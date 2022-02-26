export const getParentElement = (child, parentTag) => {
    let parentNode = null;
    let ele = this;
    do {
        parentNode = child.parentNode;
        ele = parentNode;
    } while (parentNode !== null &&
        parentNode.tagName.toUpperCase() !== parentTag.toUpperCase());
    return parentNode;
};
export const fire = (element, name, data) => {
    const event = new CustomEvent(name, {
        detail: data
    });
    element.dispatchEvent(event);
};
//# sourceMappingURL=Tool.js.map