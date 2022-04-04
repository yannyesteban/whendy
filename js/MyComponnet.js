class MyComponent extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
<style>
  :host {
    display:block;
    border:2px solid red;
    
  }

  :host:not(:defined) {
    display:none;
    
  }
</style><slot></slot>

`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }
    static get observedAttributes() {
        return ["f", "latitude", "longitude"];
    }
    connectedCallback() {
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        this[name] = newVal;
    }
    set name(value) {
        this.setAttribute("name", value);
    }
    get name() {
        return this.getAttribute("name");
    }
    set visible(value) {
        if (Boolean(value)) {
            this.setAttribute("visible", "");
        }
        else {
            this.removeAttribute("visible");
        }
    }
    get visible() {
        return this.hasAttribute("visible");
    }
}
customElements.define("my-component", MyComponent);
//# sourceMappingURL=MyComponnet.js.map