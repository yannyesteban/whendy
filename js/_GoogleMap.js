var _Map_config;
export class Map extends HTMLElement {
    constructor() {
        super();
        this.server = "";
        this.length = 100;
        this.innerHTML = "";
        this.innerHtml = "";
        this._obj = {};
        _Map_config.set(this, {});
    }
    set obj(value) {
        this._obj = value;
        console.log(this._obj);
    }
    get obj() {
        return this._obj;
    }
    set man(value) {
        const isChecked = Boolean(value);
        if (isChecked)
            this.setAttribute('man', 'x');
        else
            this.removeAttribute('man');
    }
    get man() {
        return this.hasAttribute('man');
    }
    static get observedAttributes() {
        return ['server', 'length', 'innerHtml'];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }
    connectedCallback() {
        console.log(this.innerHtml);
        //this.innerHTML = this.innerHtml+this.length;
        //this.innerHTML = `hola es un Map con ${this.length}...!!!`;
    }
    test() {
        console.log("test from Map.ts");
    }
}
_Map_config = new WeakMap();
customElements.define('wh-map', Map);
window["WHMap"] = Map;
//# sourceMappingURL=_GoogleMap.js.map