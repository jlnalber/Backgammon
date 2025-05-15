export function getImageToBase64(base64: string, then?: () => void): HTMLImageElement | undefined {
    if (IMAGE_CACHE[base64]) {
        return IMAGE_CACHE[base64];
    }
    else {
        const image = new Image();
        image.onload = () => {
            IMAGE_CACHE[base64] = image;
            if (then) {
                then();
            }
        }
        image.src = base64;

        if (image.complete) {
            return image;
        }
        return undefined;
    }
}

const IMAGE_CACHE: { [name: string]: HTMLImageElement } = {};