import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
import "../WHTab.js";
class GTUnitMenu extends HTMLElement {
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
        console.log(source);
        const win = $(this).create("wh-win");
        win.attr({ resizable: "true", width: "400px", "height": "400px",
            movible: "true" });
        const header = win.create("wh-win-header");
        header.create("wh-win-caption").html("hello");
        win.get().style.position = "fixed";
        win.get().style.top = "50px";
        win.get().style.left = "50px";
        const body = win.create("wh-win-body");
        //body.html("yanny esteban");
        const menu = body.create("wh-menu");
        menu.get().dataSource = {
            items: source.unitData,
            hideCheck: false,
            checkbox: true,
            hideIcon: false,
        };
        console.log({
            items: source.unitData
        });
        menu.on("link-check", (event) => {
            console.log(event.target);
        });
    }
}
customElements.define("gt-unit-menu", GTUnitMenu);
//# sourceMappingURL=GTUnitMenu%20copy.js.map