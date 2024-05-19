import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ImageItem } from 'src/types/imageItem';

export const useImageLibraryStore = defineStore('imageLibrary', () => {

    const DOWNLOAD_RETRIES = 3;
    const DOWNLOAD_RETRY_DELAY_MILLIS = 500;

    const imageList = ref<ImageItem[]>([]);

    let idSequence = 0;

    function addImage(displayName: string, blobUrl: string) {
        console.log(`Adding blob URL: ${blobUrl}`); // TODO TESTING REMOVE
        imageList.value.push({
            id: idSequence.toString(),
            displayName,
            blobUrl,
        });
        ++idSequence;
    }

    function removeImage(id: string) {
        const index = imageList.value.findIndex(item => item.id === id);
        if (index < 0) {
            return;
        }
        const removedItem = imageList.value[index];
        URL.revokeObjectURL(removedItem.blobUrl);
        imageList.value.splice(index, 1);
    }

    function addImageFromFile(file: File | null | undefined) {
        if (file) {
            addImage(file.name, URL.createObjectURL(file));
        }
    }

    async function addImageFromUrl(url: string) {
        if (!url) {
            return;
        }

        for (let i = DOWNLOAD_RETRIES - 1; i >= 0; --i) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    addImage(url.split('/').pop() || url,
                            URL.createObjectURL(await response.blob()));
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
