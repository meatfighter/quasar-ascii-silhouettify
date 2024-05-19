import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ImageItem } from 'src/types/imageItem';

export const useImageLibraryStore = defineStore('imageLibrary', () => {

    const DOWNLOAD_RETRIES = 3;
    const DOWNLOAD_RETRY_DELAY_MILLIS = 500;

    const imageList = ref<ImageItem[]>([]);

    function removeImage(index: number) {
        URL.revokeObjectURL(imageList.value[index].blobUrl);
        imageList.value.splice(index, 1);
    }

    function addImageFromFile(file: File | null | undefined) {
        if (!file) {
            return;
        }

        imageList.value.push({
            blobUrl: URL.createObjectURL(file),
            name: file.name,
        });
    }

    async function addImageFromUrl(url: string) {
        if (!url) {
            return;
        }

        for (let i = DOWNLOAD_RETRIES - 1; i >= 0; --i) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    imageList.value.push({
                        blobUrl: URL.createObjectURL(await response.blob()),
                        name: url.split('/').pop() || url
                    });
                    return;
                }
            } catch {
            }
            await new Promise(resolve => setTimeout(resolve,
                    DOWNLOAD_RETRY_DELAY_MILLIS));
        }

        throw new Error(`Error downloading ${url}`);
    }

    return { imageList, removeImage, addImageFromFile, addImageFromUrl };
});
