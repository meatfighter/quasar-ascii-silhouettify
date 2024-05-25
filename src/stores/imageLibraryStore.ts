import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ImageItem, makeImageItemFromFile, makeImageItemFromUrl } from 'src/types/imageItem';

export const useImageLibraryStore = defineStore('imageLibrary', () => {
    const imageList = ref<ImageItem[]>([]);

    function removeImage(id: string) {
        const index = imageList.value.findIndex(item => item.id === id);
        if (index < 0) {
            return;
        }
        const removedItem = imageList.value[index];
        URL.revokeObjectURL(removedItem.blobUrl);
        imageList.value.splice(index, 1);
    }

    async function addImagesFromFiles(files: FileList): Promise<string[]> {
        const promises = new Array<Promise<ImageItem>>(files.length);
        for (let i = files.length - 1; i >= 0; --i) {
            promises[i] = makeImageItemFromFile(files[i]);
        }
        const errorMessages: string[] = [];
        const imageItems: ImageItem[] = [];
        (await Promise.allSettled(promises)).forEach(result => {
            if (result.status === 'fulfilled') {
                imageItems.push((result as PromiseFulfilledResult<ImageItem>).value);
            } else {
                errorMessages.push((result as PromiseRejectedResult).reason.message);
            }
        });
        imageList.value.push(...imageItems);
        return errorMessages
    }

    async function addImageFromUrl(url: string) {
        imageList.value.push(await makeImageItemFromUrl(url));
    }

    return { imageList, removeImage, addImagesFromFiles, addImageFromUrl };
});
