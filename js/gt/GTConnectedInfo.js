import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
class GTConnectedInfo extends HTMLElement {
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
    connectedCallback() {
    }
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
        this.units = source.units;
        customElements.whenDefined("wh-win").then(() => {
            const win = $.create("wh-win");
            const header = win.create("wh-win-header");
            win.prop(source.win);
            header.create("wh-win-caption").html(this.caption);
            win.get().style.position = "fixed";
            const body = win.create("wh-win-body");
            $(this).append(win);
            this._win = win.get();
            this.createGrid(body);
        });
    }
    getStore() {
        return document.querySelector(`gt-unit-store`);
    }
    set show(value) {
        if (this._win) {
            this._win.visibility = (value) ? "visible" : "hidden";
        }
    }
    createGrid(body) {
        customElements.whenDefined("wh-grid").then(e => {
            const data = this.units.map(e => {
                return { unitId: e.unitId,
                    unitName: e.unitName,
                    statusName: e.statusName,
                    deviceId: e.deviceId };
            });
            console.log(data);
            const grid = $(body).create("wh-grid").get();
            grid.dataSource = {
                caption: "datos personales",
                selectMode: "",
                fields: [
                    {
                        name: "unitId",
                        caption: "id",
                        hidden: true
                    },
                    {
                        name: "unitName",
                        caption: "Unidad"
                    },
                    {
                        name: "statusName",
                        caption: "Status"
                    },
                    {
                        name: "deviceId",
                        caption: "Devide ID"
                    },
                ],
                data: data
            };
        });
    }
}
customElements.define("gt-connected-info", GTConnectedInfo);
//# sourceMappingURL=GTConnectedInfo.js.map