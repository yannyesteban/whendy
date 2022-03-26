class WHSelect extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
		<link rel="stylesheet" href="./../css/WHRadio.css">
		<select></select><slot></slot>

		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (evt) => {
            let select = this.shadowRoot.querySelector('select');
            select.append(...evt.target.assignedNodes());
            //const nodes = slot.assignedNodes();
            //select.innerHTML = this.innerHTML; 
        });
    }
    static get observedAttributes() {
        return ["f", "latitude", "longitude"];
    }
    connectedCallback() {
        const select = this.shadowRoot.querySelector(`select`);
        //select.innerHTML = this.innerHTML; 
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        this[name] = newVal;
    }
}
customElements.define("wh-select", WHSelect);
//# sourceMappingURL=select.js.map