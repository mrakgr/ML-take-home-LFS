const registry = new FinalizationRegistry<string>(x => { URL.revokeObjectURL(x) });

export const createFinalizedObjectUrl = (image: Blob) => {
    const url = URL.createObjectURL(image)
    registry.register(image, url)
    return url
}