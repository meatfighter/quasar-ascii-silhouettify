import { getHtmlColors } from 'src/app/colors';
import { getGlyphInfo } from 'src/types/glyphInfo';
import Ascii from 'src/types/ascii';

const { glyphs } = getGlyphInfo();

const EOL = '\n';
const MAX_NEOFETCH_INDICES = 6;

export function toNeofetch(asciis: Ascii[]) {
    let text = '';

    asciis.forEach(ascii => {
        const coloredGlyphsArray = ascii.coloredGlyphsArray;
        const uniqueIndices = new Set<number>();
        coloredGlyphsArray.forEach(coloredGlyphs => {
            if (coloredGlyphs.color) {
                uniqueIndices.add(coloredGlyphs.colorIndex);
            }
        });
        const indices = Array.from(uniqueIndices).sort((a, b) => a - b);
        if (indices.length > MAX_NEOFETCH_INDICES) {
            throw new Error(`Found more than ${MAX_NEOFETCH_INDICES} unique color indices.`);
        }
        const styles = new Array<string>(256);
        for (let i = 0; i < indices.length; ++i) {
            styles[indices[i]] = `\${c${i + 1}}`;
        }

        if (indices.length > 0) {
            text += 'colors';
            indices.forEach(index => text += ' ' + index);
            text += EOL + EOL;
        }

        for (let i = 0; i < coloredGlyphsArray.length; ++i) {
            const coloredGlyphs = coloredGlyphsArray[i];
            if (coloredGlyphs.color && (i === 0 || coloredGlyphsArray[i - 1].colorIndex !== coloredGlyphs.colorIndex)) {
                text += styles[coloredGlyphs.colorIndex];
            }
            coloredGlyphs.glyphIndices.forEach(index => text += glyphs[index].neofetchEscapedCharacter);
            if (coloredGlyphs.endOfLine) {
                text += EOL;
            }
        }
    });

    return text;
}

export function toText(asciis: Ascii[], ansi16: boolean) {
    let text = '';

    let color = false;
    asciis.forEach(ascii => {
        const coloredGlyphsArray = ascii.coloredGlyphsArray;
        for (let i = 0; i < coloredGlyphsArray.length; ++i) {
            const coloredGlyphs = coloredGlyphsArray[i];
            if (coloredGlyphs.color && (i === 0 || coloredGlyphsArray[i - 1].colorIndex !== coloredGlyphs.colorIndex)) {
                color = true;
                if (ansi16) {
                    if (coloredGlyphs.colorIndex < 8) {
                        text += `\x1b[3${coloredGlyphs.colorIndex}m`;
                    } else {
                        text += `\x1b[1;3${coloredGlyphs.colorIndex - 8}m`;
                    }
                } else {
                    text += `\x1b[38;5;${coloredGlyphs.colorIndex}m`;
                }
            }
            coloredGlyphs.glyphIndices.forEach(index => text += glyphs[index].character);
            if (coloredGlyphs.endOfLine) {
                text += EOL;
            }
        }
    });

    if (color) {
        // Append ANSI escape code to reset the text formatting to the terminal's default settings.
        text += '\x1b[0m';
    }

    return text;
}

export function toHtml(asciis: Ascii[], title: string, fontSize: number, lineHeight: number) {
    const htmlColors = getHtmlColors();

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#0C0C0C">
    <meta name="date" content="${new Date().toISOString()}" scheme="YYYY-MM-DDTHH:mm:ssZ">
    <link href="https://fonts.cdnfonts.com/css/cascadia-code" rel="stylesheet">
    <title>${title}</title>   
    <style>
      * {
        font-variant-ligatures: none;
        font-feature-settings: 'liga' 0, 'clig' 0;
      }
      html, body {
        background: #0C0C0C;
        color: #CCCCCC;
        text-align: center;
      }
      pre {
        font-family: 'Cascadia Code', sans-serif;
        font-size: ${fontSize}pt; 
        line-height: ${lineHeight};
      }        
    </style>    
</head>
<body>
    <pre>`;

    asciis.forEach(ascii => {
        const coloredGlyphsArray = ascii.coloredGlyphsArray;
        for (let i = 0; i < coloredGlyphsArray.length; ++i) {
            const coloredGlyphs = coloredGlyphsArray[i];
            if (coloredGlyphs.color && (i === 0 || coloredGlyphsArray[i - 1].colorIndex !== coloredGlyphs.colorIndex)) {
                html += `<span style="color: #${htmlColors[coloredGlyphs.colorIndex]};">`;
            }
            coloredGlyphs.glyphIndices.forEach(index => html += glyphs[index].htmlEscapedCharacter);
            if (coloredGlyphs.endOfLine) {
                html += EOL;
            }
            if (coloredGlyphs.color && (i === coloredGlyphsArray.length - 1
                    || coloredGlyphs.colorIndex !== coloredGlyphsArray[i + 1].colorIndex)) {
                html += '</span>';
            }
        }
    });

    html += `    </pre>   
</body>
</html>`

    return html;
}