import { defineStore } from 'pinia';
import { ref } from 'vue';
import ImageItem from 'src/types/imageItem';
import { loadImageData } from 'src/utils/images';

export const useImageLibraryStore = defineStore('imageLibrary', () => {

    const DOWNLOAD_RETRIES = 3;
    const DOWNLOAD_RETRY_DELAY_MILLIS = 500;

    const imageList = ref<ImageItem[]>([]);

    let idSequence = 0;

    function addImage(blobUrl: string, displayName?: string) {
        loadImageData(blobUrl, displayName).then((imageData) => {
            imageList.value.push({
                id: idSequence.toString(),
                imageData,
                blobUrl,
                displayName: displayName || 'unknown',
            });
            ++idSequence;
        })


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

    async function addImageFromFile(file?: File) {
        if (file) {
            await addImage(URL.createObjectURL(file), file.name);
        }
    }

    async function addImageFromUrl(url?: string) {
        if (!url) {
            return;
        }

        for (let i = DOWNLOAD_RETRIES - 1; i >= 0; --i) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    addImage(URL.createObjectURL(await response.blob()), url.split('/').pop() || url);
                    return;
                }
            } catch {
            }
            await new Promise(resolve => setTimeout(resolve, DOWNLOAD_RETRY_DELAY_MILLIS));
        }

        throw new Error(`Error downloading ${url}`);
    }

    return { imageList, removeImage, addImageFromFile, addImageFromUrl };
});
