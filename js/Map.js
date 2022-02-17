var _Map_config;
export class Map extends HTMLElement {
    constructor() {
        super();
        this.server = "";
        this.length = 100;
        _Map_config.set(this, {});
    }
    static get observedAttributes() {
        return ['server', 'length'];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }
    connectedCallback() {
        console.log('Map');
        this.innerHTML = `hola es un Map con ${this.length}...!!!`;
    }
    test() {
        console.log("test from Map.ts");
    }
}
_Map_config = new WeakMap();
customElements.define('wh-map', Map);
window["WHMap"] = Map;
//# sourceMappingURL=Map.js.map