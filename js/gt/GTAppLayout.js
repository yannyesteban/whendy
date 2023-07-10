import { getParentElement, whenApp } from "../Tool.js";
import "../WHTab.js";
class GTAppLayout extends HTMLElement {
    constructor() {
        super();
        this._win = null;
        this._menu = null;
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
        return [""];
    }
    connectedCallback() { }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
    }
    set caption(value) {
        if (Boolean(value)) {
            this.setAttribute("caption", value);
        }
        else {
            this.removeAttribute("caption");
        }
    }
    get caption() {
        return this.getAttribute("caption");
    }
    getApp() {
        return getParentElement(this, "wh-app");
    }
    set dataSource(source) {
        console.log(source);
        const cW = document.documentElement.clientWidth;
        const cH = document.documentElement.clientHeight;
        console.log({ cW, cH });
        whenApp(this).then((app) => {
            if (cW >= 600) {
                app.go({
                    request: [
                        {
                            type: "element",
                            element: "app",
                            name: `${source.APP_PATH}/webcar-desktop.json`,
                            method: "init",
                        },
                    ],
                });
            }
            else {
                app.go({
                    request: [
                        {
                            type: "element",
                            element: "app",
                            name: `${source.APP_PATH}/webcar-mobil.json`,
                            method: "init",
                        },
                    ],
                });
            }
        });
    }
    getStore() {
        return document.querySelector(`gt-unit-store`);
    }
}
customElements.define("gt-app-layout", GTAppLayout);
//# sourceMappingURL=GTAppLayout.js.map