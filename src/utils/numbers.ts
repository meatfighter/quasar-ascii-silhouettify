export function clamp(value: number, min: number, max: number, def: number, int = false) {
    if (int) {
        value = Math.round(value);
    }
    if (Number.isNaN(value)) {
        return def;
    }
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}