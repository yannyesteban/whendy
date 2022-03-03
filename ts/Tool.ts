export const getParentElement = (child, parentTag: string) => {

    let parent = child.parentNode;

    while (parent !== null) {
        if (parent.tagName === parentTag.toLocaleUpperCase()) {

            return parent;
        }
        parent = parent.parentNode;
    }

    return null;
}

export const fire = (element, name, data) => {
    const event = new CustomEvent(name, {
        detail: data
    });

    element.dispatchEvent(event);
}
