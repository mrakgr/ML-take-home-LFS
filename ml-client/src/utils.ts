function createFinalizedObjectUrl_template<A extends object, B>(destructor : (heldValue : B) => void, constr : (target : A) => B) {
    const registry = new FinalizationRegistry<B>(destructor);

    return (image: A) => {
        const url = constr(image)
        registry.register(image, url)
        return url
    }
}

export const createFinalizedObjectUrl = createFinalizedObjectUrl_template<Blob,string>(
    url => URL.revokeObjectURL(url), 
    image => URL.createObjectURL(image)
    )