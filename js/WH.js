class WHIcon extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.slot = "icon";
    }
}
customElements.define("wh-icon", WHIcon);
class WHCaption extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.slot = "caption";
    }
}
customElements.define("wh-caption", WHCaption);
//# sourceMappingURL=WH.js.map