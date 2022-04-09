import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
import "../WHTab.js";
import * as Tool from "../Tool.js";
class GTUnitInfo extends HTMLElement {
    constructor() {
        super();
        this._win = null;
        this._menu = null;
        this._last = null;
        this._unitChange = this._unitChange.bind(this);
        this._unitsChange = this._unitsChange.bind(this);
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
        Tool.whenApp(this).then((app) => {
            $(app).on("unit-data-set", this._unitChange);
            $(app).on("units-data-changed", this._unitsChange);
        });
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
        Tool.whenApp(this).then((app) => {
            $(app).off("unit-data-set", this._unitChange);
            $(app).off("units-data-changed", this._unitsChange);
        });
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
        customElements.whenDefined("wh-win").then(() => {
            const win = $.create("wh-win");
            const header = win.create("wh-win-header");
            win.prop(source.win);
            header.create("wh-win-caption").html(this.caption);
            win.get().style.position = "fixed";
            //win.get().style.top = "150px";
            //win.get().style.right = "50px"
            const body = win.create("wh-win-body");
            $(this).append(win);
            this._win = win.get();
            //this._win.mode = "modal"
            const info = body.create("wh-info");
            info.html(this.template);
        });
    }
    getStore() {
        return document.querySelector(`gt-unit-store`);
    }
    whenStore() {
        return new Promise((resolve, reject) => {
            customElements.whenDefined('gt-unit-store').then(() => {
                const store = document.querySelector(`gt-unit-store`);
                if (store) {
                    resolve(store);
                }
                reject('error');
            });
        });
    }
    set show(value) {
        if (this._win) {
            this._win.visibility = (value) ? "visible" : "hidden";
        }
    }
    _unitChange({ detail }) {
        this._last = detail;
        this._setData();
    }
    _unitsChange({ detail }) {
        console.log(detail);
        if (detail.unitId) {
            this._last = detail.unitId;
            this._setData();
        }
    }
    _setData() {
        const info = $(this).query(`wh-info`);
        info.prop("data", this._last);
    }
}
customElements.define("gt-unit-info", GTUnitInfo);
//# sourceMappingURL=GTUnitInfo.js.map