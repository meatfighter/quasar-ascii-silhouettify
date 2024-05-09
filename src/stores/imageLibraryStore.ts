import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ImageItem } from 'src/types/imageItem';

export const useImageLibraryStore = defineStore('imageLibrary', () => {

    const imageList = ref<ImageItem[]>([]);

    function removeImage(index: number) {
        imageList.value.splice(index, 1);
    }

    function addImage(file: File) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                  imageList.value.push({ src: e.target.result.toString() });
                }
            };
            reader.readAsDataURL(file);
        }
    }

    return { imageList, removeImage, addImage };
});
