class GTUnitStore extends HTMLElement {
    constructor() {
        super();
    }
    static get observedAttributes() {
        return [""];
    }
    connectedCallback() {
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
    }
    set dataSource(source) {
        console.log(source);
    }
}
customElements.define("gt-unit-store", GTUnitStore);
//# sourceMappingURL=GTUnitStore.js.map