import { clearClosestColorCache, findClosestColorIndex, findClosestColorIndexAmong } from 'src/app/colors';
import { ImageContent } from 'src/types/imageContent';
import ImageContentTask from 'src/types/imageContentTask';
import { yieldToEventThread } from 'src/utils/threads';

function makeImageContent(task: ImageContentTask) {

    const { imageStateId, id, rgbas, palette, colors, darkness } = task;

    const data = rgbas.data;
    const indices = new Uint8Array(rgbas.width * rgbas.height);
    const frequencies = new Array<number>(256).fill(0);

    clearClosestColorCache();
    for (let i = 0, j = 0; i < indices.length; ++i) {
        ++frequencies[indices[i] = findClosestColorIndex(palette, darkness, data[j++], data[j++], data[j++],
                data[j++])];
    }
    clearClosestColorCache();

    const indexSet: number[] = [];
    while (true) {
        let maxIndex = -1;
        let maxFrequency = 0;
        for (let i = frequencies.length - 1; i > 0; --i) {
            if (frequencies[i] > maxFrequency) {
                maxIndex = i;
                maxFrequency = frequencies[i];
            }
        }
        if (maxIndex < 0) {
            break;
        }
        frequencies[maxIndex] = 0;
        indexSet.push(maxIndex);
    }

    if (indexSet.length <= colors) {
        return new ImageContent(imageStateId, id, indices, rgbas.width, rgbas.height);
    }

    indexSet.length = colors;

    for (let i = 0, j = 0; i < indices.length; ++i) {
        indices[i] = findClosestColorIndexAmong(indexSet, darkness, data[j++], data[j++], data[j++], data[j++]);
    }

    return new ImageContent(imageStateId, id, indices, rgbas.width, rgbas.height);
}

const tasks = new Map<string, ImageContentTask>();

export async function toImageContent(task: ImageContentTask): Promise<ImageContent | null> {
    tasks.set(task.id, task);

    await yieldToEventThread();
    const imageContent = makeImageContent(task);
    await yieldToEventThread();

    tasks.delete(task.id);

    return task.cancelled ? null : imageContent;
}

export function cancelImageContentTask(id: string) {
    const task = tasks.get(id);
    if (task) {
        task.cancelled = true;
    }
}