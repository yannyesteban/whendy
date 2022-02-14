export class Map extends HTMLElement {
    constructor() {
        super();
        this.server = "";
    }
    static get observedAttributes() {
        return ['server'];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }
    connectedCallback() {
        console.log('Map');
        this.innerHTML = "hola es un Map";
    }
}
customElements.define('wh-menu', Map);
//# sourceMappingURL=Map.js.map