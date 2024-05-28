import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ImageItem, makeImageItemFromFile, makeImageItemFromUrl } from 'src/types/imageItem';
import { onImageItems } from 'src/app/converter';

export const useImageLibraryStore = defineStore('imageLibrary', () => {
    const imageList = ref<ImageItem[]>([]);
    const loadingImages = ref(false);

    function removeAll() {
        imageList.value.length = 0;
        onImageItems(imageList.value);
    }

    function removeImage(id: string) {
        const index = imageList.value.findIndex(item => item.id === id);
        if (index < 0) {
            return;
        }
        const removedItem = imageList.value[index];
        URL.revokeObjectURL(removedItem.blobUrl);
        imageList.value.splice(index, 1);
        onImageItems(imageList.value);
    }

    async function addImagesFromFiles(files: FileList): Promise<string[]> {
        loadingImages.value = true;
        const errorMessages: string[] = [];
        try {
            const promises = new Array<Promise<ImageItem>>(files.length);
            for (let i = files.length - 1; i >= 0; --i) {
                promises[i] = makeImageItemFromFile(files[i]);
            }
            const imageItems: ImageItem[] = [];
            (await Promise.allSettled(promises)).forEach(result => {
                if (result.status === 'fulfilled') {
                    imageItems.push((result as PromiseFulfilledResult<ImageItem>).value);
                } else {
                    errorMessages.push((result as PromiseRejectedResult).reason.message);
                }
            });
            if (imageItems.length > 0) {
                imageList.value.push(...imageItems);
                onImageItems(imageList.value);
            }
        } finally {
            loadingImages.value = false;
        }
        return errorMessages;
    }

    async function addImageFromUrl(url: string) {
        loadingImages.value = true;
        try {
            imageList.value.push(await makeImageItemFromUrl(url));
            onImageItems(imageList.value);
        } finally {
            loadingImages.value = false;
        }
    }

    return { imageList, removeImage, addImagesFromFiles, addImageFromUrl, removeAll, loadingImages };
});
