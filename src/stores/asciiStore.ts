import { defineStore } from 'pinia';
import { ref } from 'vue';
import Ascii from 'src/types/ascii';

export const useAsciiStore = defineStore('asciiStore', () => {
    const asciis = ref<Ascii[]>([]);

    const processing = ref(false);

    function setAsciis(as: Ascii[]) {
        asciis.value = as;
    }

    function setProcessing(value: boolean) {
        processing.value = value;
    }

    return { asciis, setAsciis, processing, setProcessing };
});
