export async function loadImageData(src: string, displayName?: string): Promise<ImageData> {
    return new Promise<ImageData>((resolve, reject) => {
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
            resolve(ctx.getImageData(0, 0, img.width, img.height));
        };
        img.onerror = () => {
            reject(new Error(`Error loading image${displayName ? ' ' + displayName : '.'}`));
        };
    });
}