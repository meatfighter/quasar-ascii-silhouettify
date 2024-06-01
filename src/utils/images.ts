import Rgbas from 'src/types/rgbas';

export async function loadRgbas(src: string, displayName?: string): Promise<Rgbas> {
    return new Promise<Rgbas>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error(`Failed to get 2D image context${displayName ? ' for ' + displayName : '.'}`));
                return;
            }
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            resolve(new Rgbas(imageData.data, imageData.width, imageData.height));
        };
        img.onerror = () => {
            reject(new Error(`Error loading image${displayName ? ' ' + displayName : '.'}`));
        };
    });
}