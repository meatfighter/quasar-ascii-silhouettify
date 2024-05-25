import { ref, watch } from 'vue';
import { clamp } from 'src/utils/numbers';
import { defineStore } from 'pinia';
import {
    onColor,
    onColors,
    onDarkness,
    onFontSize,
    onFormat,
    onLineHeight,
    onPalette,
    onScale,
    onThreads
} from 'src/app/converter';
import { Format } from 'src/types/format';
import { Palette } from 'src/types/palette';

const TEXT_FORMAT = 'text';
const HTML_FORMAT = 'HTML';
const NEOFETCH_FORMAT = 'Neofetch';
export const FORMAT_OPTIONS = [ TEXT_FORMAT, HTML_FORMAT, NEOFETCH_FORMAT ];
export const DEFAULT_FORMAT = FORMAT_OPTIONS[0];

const PALETTE_8 = '8';
const PALETTE_16 = '16';
const PALETTE_240 = '240';
const PALETTE_256 = '256';
export const PALETTE_OPTIONS = [ PALETTE_8, PALETTE_16, PALETTE_240, PALETTE_256 ];
export const DEFAULT_PALETTE = PALETTE_OPTIONS[2];

export const DEFAULT_COLORS = 255;
export const MIN_COLORS = 1;
export const MAX_COLORS = 255;
export const COLORS_STEP = 1;

export const DEFAULT_FONT_SIZE = 12;
export const MIN_FONT_SIZE = 1;
export const MAX_FONT_SIZE = 100;
export const FONT_SIZE_STEP = MIN_FONT_SIZE;

export const DEFAULT_LINE_HEIGHT = 1.2;
export const MIN_LINE_HEIGHT = 0.05;
export const MAX_LINE_HEIGHT = 5;
export const LINE_HEIGHT_STEP = MIN_LINE_HEIGHT;

export const DEFAULT_SCALE = 1;
export const MIN_SCALE = 0.1;
export const MAX_SCALE = 10;
export const SCALE_STEP = MIN_SCALE;

export const DEFAULT_DARKNESS = 10;
export const MIN_DARKNESS = 0;
export const MAX_DARKNESS = 100;
export const DARKNESS_STEP = 5;

export const DEFAULT_THREADS = navigator.hardwareConcurrency || 1;
export const MIN_THREADS = 1;
export const MAX_THREADS = DEFAULT_THREADS;
export const THREADS_STEP = 1;

export const DEFAULT_MONOCHROME = false;

export const useOptionsStore = defineStore('options', () => {
    const format = ref(DEFAULT_FORMAT);
    watch(format, () => {
        switch (format.value) {
            case HTML_FORMAT:
                onFormat(Format.HTML);
                break;
            case NEOFETCH_FORMAT:
                onFormat(Format.NEOFETCH);
                break;
            default:
                onFormat(Format.TEXT);
                break;
        }
    });

    const palette = ref(DEFAULT_PALETTE);
    watch(palette, () => {
        switch (palette.value) {
            case PALETTE_8:
                onPalette(Palette.STANDARD_8);
                break;
            case PALETTE_16:
                onPalette(Palette.STANDARD_16);
                break;
            case PALETTE_240:
                onPalette(Palette.EXTENDED_240);
                break;
            case PALETTE_256:
                onPalette(Palette.EXTENDED_256);
                break;
        }
    });

    const colors = ref(DEFAULT_COLORS);
    watch(colors, () => {
        const newValue = clamp(colors.value, MIN_COLORS, MAX_COLORS, DEFAULT_COLORS, true);
        if (colors.value !== newValue) {
            colors.value = newValue;
            onColors(newValue);
        }
    });

    const fontSize = ref(DEFAULT_FONT_SIZE);
    watch(fontSize, () => {
        const newValue = clamp(fontSize.value, MIN_FONT_SIZE, MAX_FONT_SIZE, DEFAULT_FONT_SIZE);
        if (fontSize.value !== newValue) {
            fontSize.value = newValue;
            onFontSize(newValue);
        }
    });

    const lineHeight = ref(DEFAULT_LINE_HEIGHT);
    watch(lineHeight, () => {
        const newValue = clamp(lineHeight.value, MIN_LINE_HEIGHT, MAX_LINE_HEIGHT, DEFAULT_LINE_HEIGHT);
        if (lineHeight.value !== newValue) {
            lineHeight.value = newValue;
            onLineHeight(newValue);
        }
    });

    const scale = ref(DEFAULT_SCALE);
    watch(scale, () => {
        const newValue = clamp(scale.value, MIN_SCALE, MAX_SCALE, DEFAULT_SCALE);
        if (scale.value !== newValue) {
            scale.value = newValue;
            onScale(newValue);
        }
    });

    const darkness = ref(DEFAULT_DARKNESS);
    watch(darkness, () => {
        const newValue = clamp(darkness.value, MIN_DARKNESS, MAX_DARKNESS, DEFAULT_DARKNESS);
        if (darkness.value !== newValue) {
            darkness.value = newValue;
            onDarkness(newValue);
        }
    });

    const threads = ref(DEFAULT_THREADS);
    watch(threads, () => {
        const newValue = clamp(threads.value, MIN_THREADS, MAX_THREADS, DEFAULT_THREADS, true);
        if (threads.value !== newValue) {
            threads.value = newValue;
            onThreads(threads.value);
        }
    });

    const monochrome = ref(DEFAULT_MONOCHROME);
    watch(monochrome, () => onColor(!monochrome.value));

    function reset() {
        format.value = DEFAULT_FORMAT;
        palette.value = DEFAULT_PALETTE;
        colors.value = DEFAULT_COLORS;
        fontSize.value = DEFAULT_FONT_SIZE;
        lineHeight.value = DEFAULT_LINE_HEIGHT;
        scale.value = DEFAULT_SCALE;
        darkness.value = DEFAULT_DARKNESS;
        threads.value = DEFAULT_THREADS;
        monochrome.value = DEFAULT_MONOCHROME;
    }

    return { format, palette, colors, fontSize, lineHeight, scale, darkness, threads, monochrome, reset };
});