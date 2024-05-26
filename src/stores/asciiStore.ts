import { defineStore } from 'pinia';
import { ref } from 'vue';
import Ascii from 'src/types/ascii';

export const useAsciiStore = defineStore('asciiStore', () => {
    const asciis = ref<Ascii[]>([]);

    function setAsciis(as: Ascii[]) {
        asciis.value = as;
    }

    return { asciis, setAsciis };
});
