export class Map extends HTMLElement {
    constructor() {
        super();
    }
    static get observedAttributes() {
        return [""];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
    }
    connectedCallback() {
        console.log("connectedCallback");
    }
    test() {
        console.log("test from Map.ts");
    }
}
customElements.define('wh-map', Map);
//# sourceMappingURL=Map.js.map