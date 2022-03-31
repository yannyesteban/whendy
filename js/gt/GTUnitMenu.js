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
        win.attr({
            resizable: "true", width: "400px", "height": "400px",
            movible: "true"
        });
        const header = win.create("wh-win-header");
        header.create("wh-win-caption").html("hello");
        win.get().style.position = "fixed";
        win.get().style.top = "50px";
        win.get().style.left = "50px";
        const body = win.create("wh-win-body");
        //body.html("yanny esteban");
        const menu = body.create("wh-menu");
        customElements.whenDefined('wh-menu').then(() => {
            menu.get()["dataSource"] = {
                items: source.unitData,
                hideCheck: false,
                checkbox: true,
                hideIcon: false,
                events: {
                    "link-action": (event => {
                        const item = $(event.target);
                        if (item.hasClass("unit")) {
                            console.log(event.target.value);
                            //this.getStore().getUnitData(event.target.value)
                            this.getStore().run("load-unit", event.target.value, 1);
                            return;
                            const data = this.getStore().store;
                            data.unit.active = 1024;
                            data.unitss[2027].status = 45;
                            console.log(data.unit);
                        }
                    }),
                    "link-check": (event => {
                        const item = $(event.target);
                        if (item.hasClass("unit")) {
                            console.log(event.target.checked);
                            const store = this.getStore();
                            if (store) {
                                store.run("load-unit", event.target.value, event.target.checked);
                            }
                            return;
                            console.log(event.target.value);
                            //this.getStore().getUnitData(event.target.value)
                            this.getStore().run("load-unit", event.target.value);
                            const data = this.getStore().store;
                            data.unit.active = 1024;
                            data.unitss[2027].status = 45;
                            console.log(data.unit);
                        }
                    })
                }
            };
            console.log({
                items: source.unitData
            });
            menu.on("link-check", (event) => {
                console.log(event.target);
            });
        });
        customElements.whenDefined('gt-unit-store').then(() => {
            const store = this.getStore();
            console.log(store);
            $(store).on("unit-data-changed", ({ detail }) => {
                console.log(detail);
                const item = this.getUnitItem(detail.unitId);
                if (item) {
                    item.checked = detail.active;
                }
                else {
                    console.log("error");
                }
            });
            /*
            store.registerRequest = {name:"laodUnit", request:{
                "type":"element",
                
                "element": "gt-unit",
                "name": null,
                "method": "load-unit-data",
                "config": {
                    unitId: 4036
                }
            }};

            */
        });
    }
    getUnitItem(id) {
        return document.querySelector(`wh-menu wh-menu-item.unit[value="${id}"]`);
    }
    getStore() {
        return document.querySelector(`gt-unit-store`);
    }
}
customElements.define("gt-unit-menu", GTUnitMenu);
//# sourceMappingURL=GTUnitMenu.js.map