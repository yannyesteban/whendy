import { Q as $ } from "./Q.js";
export class WHSelect extends HTMLElement {
    static get observedAttributes() {
        return [];
    }
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
    set value(value) {
        this.shadowRoot.querySelector(`select`).value = value;
    }
    get value() {
        return this.shadowRoot.querySelector(`select`).value;
    }
    set data(options) {
        this.innerHTML = "";
        options.forEach(info => {
            const option = $(this).create("option");
            option.value(info[0] || "");
            option.html(info[1] || "");
            if (info[2]) {
                $(option).ds("group", info[2]);
            }
        });
    }
}
customElements.define("wh-select", WHSelect);
//# sourceMappingURL=select.js.map