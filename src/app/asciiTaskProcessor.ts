import AsciiTask from 'src/app/asciiTask';
import { Ascii, ColoredGlyphs } from 'src/app/ascii';
import { getIndex } from 'src/app/imageContent';
import { yieldToEventThread } from 'src/utils/threads';
import { EOL, SPACE } from 'src/app/glyphs';

async function toMonochromeAscii(task: AsciiTask, originX: number, originY: number): Promise<Ascii | null> {

    const { image, rows, rowScale, cols, colScale, glyphScaleX, glyphScaleY, glyphInfo } = task;
    const { width: glyphWidth, height: glyphHeight, masks: glyphMasks, glyphs } = glyphInfo;

    const glyphIndices: number[] = [];
    let matched = 0;
    const region = new Array<number>(3);
    for (let r = 0; r < rows; ++r) {
        const glyphOriginY = originY + rowScale * r;
        for (let c = 0; c < cols; ++c) {
            const glyphOriginX = originX + colScale * c;

            region[2] = 0x7FFFFFFF;
            region[1] = region[0] = 0xFFFFFFFF;

            // Attempt to substitute the region with a glyph starting with the character containing the most pixels down
            // to the space character. If any of the glyph's pixels coincide with a black pixel in image region, then
            // that character is excluded.
            for (let y = 0; y < glyphHeight; ++y) {
                const glyphY = glyphOriginY + glyphScaleY * y;
                const tableOffset = glyphWidth * y;
                for (let x = 0; x < glyphWidth; ++x) {
                    const glyphX = glyphOriginX + glyphScaleX * x;
                    if (getIndex(image, glyphX, glyphY) === 0) {
                        const row = glyphMasks[tableOffset + x];
                        region[2] &= row[2];
                        region[1] &= row[1];
                        region[0] &= row[0];
                    }
                }
            }

            let glyphIndex: number;
            if (region[2] !== 0) {
                glyphIndex = 95 - Math.clz32(region[2]);
            } else if (region[1] !== 0) {
                glyphIndex = 63 - Math.clz32(region[1]);
            } else {
                glyphIndex = 31 - Math.clz32(region[0]);
            }

            // Append the printable ASCII character.
            glyphIndices.push(glyphIndex);

            // Tally the number of glyph pixels that align with image pixels.
            matched += glyphs[glyphIndex].count;
        }
        glyphIndices.push(EOL);

        await yieldToEventThread();
        if (task.cancelled) {
            return null;
        }
    }

    return new Ascii(task.imageIndex, task.id, [ new ColoredGlyphs(glyphIndices, -1) ], matched);
}

async function toColorAscii(task: AsciiTask, originX: number, originY: number): Promise<Ascii | null> {

    const { image, rows, rowScale, cols, colScale, glyphScaleX, glyphScaleY, glyphInfo } = task;
    const { width: glyphWidth, height: glyphHeight, masks: glyphMasks, glyphs, minCount: glyphMinCount } = glyphInfo;

    const region = new Array<number>(3);
    const colorIndexCounts = new Map<number, number>();
    const textBlocks: ColoredGlyphs[] = [];
    const glyphIndices: number[] = [];
    let lastColorIndex = -1;
    let matched = 0;
    for (let r = 0; r < rows; ++r) {
        const glyphOriginY = originY + rowScale * r;
        for (let c = 0; c < cols; ++c) {
            const glyphOriginX = originX + colScale * c;

            // Count the number of times each color index appears in the rectangular region to be replaced by a glyph.
            colorIndexCounts.clear();
            for (let y = 0; y < glyphHeight; ++y) {
                const glyphY = glyphOriginY + glyphScaleY * y;
                for (let x = 0; x < glyphWidth; ++x) {
                    const glyphX = glyphOriginX + glyphScaleX * x;
                    const colorIndex = getIndex(image, glyphX, glyphY);

                    // Do not count very dark colors.
                    if (colorIndex !== 0) {
                        const count = colorIndexCounts.get(colorIndex);
                        colorIndexCounts.set(colorIndex, (count === undefined) ? 1 : count + 1);
                    }
                }
            }

            // Remove counts less-than the minimum number of pixels in a printable ASCII character that is not a space.
            colorIndexCounts.forEach((count, colorIndex) => {
                if (count < glyphMinCount) {
                    colorIndexCounts.delete(colorIndex);
                }
            });

            // If there are no counts, then the region is very dark. Replace with a space character in that case.
            if (colorIndexCounts.size === 0) {
                glyphIndices.push(SPACE);
                continue;
            }

            // For each of the remaining counted color indices, attempt to substitute the region with a colored glyph
            // starting with the character containing the most pixels down to the space character. If any of the
            // glyph's pixels do not coincide with an image pixel of a specified color index, then that character is
            // excluded.
            let bestGlyphIndex = 0;
            let bestColorIndex = 0;
            colorIndexCounts.forEach((_, colorIndex) => {

                region[2] = 0x7FFFFFFF;
                region[1] = region[0] = 0xFFFFFFFF;

                for (let y = 0; y < glyphHeight; ++y) {
                    const glyphY = glyphOriginY + glyphScaleY * y;
                    const tableOffset = glyphWidth * y;
                    for (let x = 0; x < glyphWidth; ++x) {
                        const glyphX = glyphOriginX + glyphScaleX * x;
                        if (getIndex(image, glyphX, glyphY) !== colorIndex) {
                            const row = glyphMasks[tableOffset + x];
                            region[2] &= row[2];
                            region[1] &= row[1];
                            region[0] &= row[0];
                        }
                    }
                }

                let glyphIndex: number;
                if (region[2] !== 0) {
                    glyphIndex = 95 - Math.clz32(region[2]);
                } else if (region[1] !== 0) {
                    glyphIndex = 63 - Math.clz32(region[1]);
                } else {
                    glyphIndex = 31 - Math.clz32(region[0]);
                }

                // Accept the best character and color combination.
                if (glyphs[glyphIndex].count > glyphs[bestGlyphIndex].count) {
                    bestGlyphIndex = glyphIndex;
                    bestColorIndex = colorIndex;
                }
            });

            // If no best is found, then no non-space character of any color aligns with all the pixels in the region.
            // A space is the only acceptable character in that case.
            if (bestGlyphIndex === 0) {
                glyphIndices.push(SPACE);
                continue;
            }

            // If the color is different from the previous one, then append the ANSI escape code to set the foreground
            // color to an index of the 256-color palette.
            if (lastColorIndex !== bestColorIndex && lastColorIndex >= 0) {
                textBlocks.push(new ColoredGlyphs(glyphIndices, lastColorIndex)); // constructor copies glyphIndices
                glyphIndices.length = 0;
            }
            lastColorIndex = bestColorIndex;

            // Append the printable ASCII character.
            glyphIndices.push(bestGlyphIndex);

            // Tally the number of glyph pixels that align with image pixels.
            matched += glyphs[bestGlyphIndex].count;
        }
        glyphIndices.push(EOL);

        await yieldToEventThread();
        if (task.cancelled) {
            return null;
        }
    }

    if (glyphIndices.length > 0) {
        textBlocks.push(new ColoredGlyphs(glyphIndices, lastColorIndex));
    }

    return new Ascii(task.imageIndex, task.id, textBlocks, matched);
}

const tasks = new Map<string, AsciiTask>();

export async function toAscii(task: AsciiTask): Promise<Ascii | null> {
    tasks.set(task.id, task);

    const func = task.color ? toColorAscii : toMonochromeAscii;

    let ascii = new Ascii(0, '', [], 0);
    for (let i = task.offsets.length - 1; i >= 0; --i) {
        const offset = task.offsets[i];
        const result = await func(task, offset.x + task.marginX, offset.y + task.marginY);
        if (!result) {
            break;
        }
        if (result.matched > ascii.matched) {
            ascii = result;
        }
    }

    tasks.delete(task.id);

    return task.cancelled ? null : ascii;
}

export function cancelTask(id: string) {
    const task = tasks.get(id);
    if (task) {
        task.cancelled = true;
    }
}