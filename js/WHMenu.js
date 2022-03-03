import "./WH.js";
class WHMenuCaption extends HTMLElement {
    constructor() {
        super();
        this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<link rel="stylesheet" href="./../css/WHHeader1.css">
			
		<slot name="icon"></slot>
		<slot name="caption"></slot>
		<div>*</div>
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}
customElements.define("wh-menu-caption", WHMenuCaption);
class WHMenugroup extends HTMLElement {
    constructor() {
        super();
        this.slot = "group";
    }
}
customElements.define("wh-submenu", WHMenugroup);
class WHMenuItem extends HTMLElement {
    static get observedAttributes() {
        return [];
    }
    constructor() {
        super();
        this.slot = "item";
        //this.slot = "header";
        const template = document.createElement("template");
        template.innerHTML = `
			
			<link rel="stylesheet" href="./../css/WHMenuItem.css">
			
			<slot name="caption"></slot>
			<slot name="group"></slot>
			
			
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        /*this.shadowRoot.addEventListener("slotchange", (event) => {
            [...event.target.assignedElements()].forEach(e => {

            })

        });*/
    }
    connectedCallback() {
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        this[name] = newVal;
    }
    getWin() {
        //return getParentElement(this, "wh-win") as WHMenuItem;
    }
}
customElements.define("wh-menu-item", WHMenuItem);
class WHMenu extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
		<link rel="stylesheet" href="./../css/WHMenu1.css">
		
		<slot name="item"></slot>

`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }
    static get observedAttributes() {
        return [];
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
}
customElements.define("wh-menu", WHMenu);
//# sourceMappingURL=WHMenu.js.map