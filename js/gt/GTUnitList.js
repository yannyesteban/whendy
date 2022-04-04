import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
import "../WHTab.js";
class GTUnitList extends HTMLElement {
    constructor() {
        super();
        return;
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
    test() {
        alert("test");
    }
    getApp() {
        return getParentElement(this, "wh-app");
    }
    set dataSource(source) {
        $(this).html("");
        customElements.whenDefined('wh-list-text').then(() => {
            const list = $(this).create("wh-list-text");
            const button = $(this).create("button");
            button.html("»");
            console.log("....");
            list.prop("dataSource", { data: source.data });
            list.on("change", (event) => {
                const store = this.getStore();
                if (store) {
                    store.run("load-units", {
                        unitId: event.target.value,
                        visible: 1,
                        active: 1
                    });
                }
            });
        });
    }
    getStore() {
        return document.querySelector(`gt-unit-store`);
    }
}
customElements.define("gt-unit-list", GTUnitList);
//# sourceMappingURL=GTUnitList.js.map