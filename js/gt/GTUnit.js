import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
class GTUnit extends HTMLElement {
    static get observedAttributes() {
        return [""];
    }
    constructor() {
        super();
    }
    connectedCallback() { }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
    }
    set dataSource(source) {
        console.log(source);
        this.whenStore().then((store) => {
            store.registerAction("load-units", (config) => {
                return [
                    {
                        type: "element",
                        element: "gt-unit",
                        name: null,
                        method: "load-units",
                        config
                    }
                ];
            });
            $(store).on("units-data-changed", ({ detail }) => {
                //store.updateItem("unit-cache", Object.assign(store.getItem("unit-cache") || {}, detail));
                console.log(Object.values(detail));
                const unit = Object.values(detail).find(unit => unit.active === 1);
                if (unit) {
                    store.updateItem("unit", unit);
                }
                console.log(store.getItem("unit-cache"));
            });
            $(store).on("unit-cache-data-set", ({ detail }) => {
                //const data = store.getIdentity("unit-cache");
                //console.log(data, detail)
                Object.values(detail).forEach(e => {
                    //store.updateItem('unit', e)
                    console.log(e);
                });
            });
            store.registerAction("load-unit", (unitId, active) => {
                return [
                    {
                        "type": "element",
                        "element": "gt-unit",
                        "name": null,
                        "method": "load-unit-data",
                        "config": {
                            unitId,
                            active
                        }
                    }
                ];
            });
            store.registerAction("load-units-status", () => {
                return [
                    {
                        "type": "element",
                        "element": "gt-unit",
                        "name": null,
                        "method": "load-units-status",
                    }
                ];
            });
            store.run("load-units-status");
        }).catch(message => {
        });
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
    getStore() {
        return document.querySelector(`gt-unit-store`);
    }
    getApp() {
        return getParentElement(this, "wh-app");
    }
}
customElements.define("gt-unit", GTUnit);
//# sourceMappingURL=GTUnit.js.map