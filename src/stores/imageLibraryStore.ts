import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ImageItem } from 'src/types/imageItem';

export const useImageLibraryStore = defineStore('imageLibrary', () => {

    const imageList = ref<ImageItem[]>([]);

    function removeImage(index: number) {
        imageList.value.splice(index, 1);
    }

    function addImageFromFile(file: File | null | undefined) {
        if (!file) {
            return;
        }

        console.log('file load start:', file);

        // TODO IT IS POSSIBLE TO RECORD LOADING (BOOLEAN) AND ERROR (BOOLEAN) IN IMAGElIST ELEMENTS

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
                imageList.value.push({
                    src: e.target.result.toString(),
                    name: file.name,
                });
            }
        };
        reader.readAsDataURL(file);
    }

    function addImageFromUrl(url: string | null | undefined) {
        if (!url) {
            return;
        }

        console.log('url load start:', url);

        imageList.value.push({
            src: url,
            name: url,
        });
    }

    return { imageList, removeImage, addImageFromFile, addImageFromUrl };
});
