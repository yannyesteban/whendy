import { Q as $ } from "./Q.js";
import { getParentElement } from "./Tool.js";
class WHField extends HTMLElement {
    constructor() {
        super();
        //this.slot = "field";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<link rel="stylesheet" href="./../css/WHHeader1.css">
			
		<slot name="label"></slot>
		<slot name="input"></slot>
		
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}
customElements.define("wh-field", WHField);
class WHForm extends HTMLElement {
    constructor() {
        super();
        this._internals = null;
        this._data = {};
        this._internals = this.attachInternals();
        const template = document.createElement("template");
        template.innerHTML = `
<style>
  :host {
    display:block;
    border:2px solid green;
    
  }

  :host:not(:defined) {
    
    
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
    get data() {
        return this._data;
    }
    set data(value) {
        const form = $(this);
        const caption = form.create("caption").html(value.caption);
        value.fields.forEach(field => {
            const f = $.create("wh-field");
            f.create("span").html(field.label).attr("slot", "label");
            f.create("input").attr({ "type": field.type, "slot": "input", name: field.name });
            form.append(f);
        });
        const nav = form.create("div");
        value.nav.items.forEach(item => {
            const button = nav.create("button").attr("type", "button").html(item.caption + "..");
            if (item.send) {
                button.on("click", (evenet) => {
                    const app = this.getApp();
                    if (app) {
                        item.send.data = this.getValues();
                        app.go(item.send);
                    }
                });
            }
        });
    }
    getValues() {
        const inputs = this.querySelectorAll(`input, select, textarea, img, button`);
        const data = {};
        inputs.forEach((e) => {
            if (e.name) {
                data[e.name] = e.value;
            }
        });
        console.log(data);
        return data;
    }
    connectedCallback() {
        console.log("two");
        //const yy = document.createElement("wh-field");
        //const yy2 = new WHField;
        //yy.innerHTML = "yanny";
        //this.appendChild(yy);
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        this[name] = newVal;
    }
    getApp() {
        return getParentElement(this, "wh-app");
    }
}
WHForm.formAssociated = true;
customElements.define("wh-form", WHForm);
//# sourceMappingURL=WHForm.js.map