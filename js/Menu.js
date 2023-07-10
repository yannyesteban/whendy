export class Menu extends HTMLElement {
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
        console.log('Custom square element added to page.');
        this.innerHTML = "hola";
    }
}
customElements.define('wh-menu', Menu);
export class MenuTest extends HTMLElement {
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
        var _a;
        console.log('Custom square element added to page.');
        this.innerHTML = "hola";
        (_a = this.getApp()) === null || _a === void 0 ? void 0 : _a.test();
    }
    getApp() {
        let parentNode = null;
        let ele = this;
        do {
            parentNode = ele.parentNode;
            ele = parentNode;
            //console.log(parentNode, parentNode.tagName)
        } while (parentNode !== null && parentNode.tagName !== "wh-app".toUpperCase());
        return parentNode;
    }
}
customElements.define('wh-menu-test', MenuTest);
//# sourceMappingURL=Menu.js.map