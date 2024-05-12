export class ImageData {
    constructor(public indices: Uint8Array, public width: number, public height: number) {
    }
}

export class ImageDataRequest {
    constructor(public imageId: string, public dataUrl: string) {
    }
}

export class ImageDataResponse {
    constructor(public success: boolean, public imageData: ImageData | undefined) {
    }
}

// This function takes a data URL and a callback function that will receive the RGBA data array.
function extractRGBAFromDataURL(dataURL: string, callback: (rgba: Uint8ClampedArray, width: number, height: number) => void): void {
    // Create an image element
    const img = new Image();

    // Set the image source to the provided data URL
    img.src = dataURL;

    // This event listener will be called once the image is loaded
    img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Retrieve the pixel data from the canvas
        const imageData = ctx.getImageData(0, 0, img.width, img.height);

        // Call the callback function with the RGBA data, width, and height
        callback(imageData.data, img.width, img.height);
    };

    // Error handling for image loading
    img.onerror = () => {
        console.error('Failed to load image from data URL');
    };
}
