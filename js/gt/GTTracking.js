import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
import "../WHTab.js";
class GTTracking extends HTMLElement {
    constructor() {
        super();
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
    test() {
        alert("test");
    }
    getApp() {
        return getParentElement(this, "wh-app");
    }
    set dataSource(source) {
        console.log(source);
        customElements.whenDefined('gt-unit-store').then(() => {
            const store = this.getStore();
            if (store) {
                store.registerRequest = {
                    name: "tracking-data", request: {
                        "type": "element",
                        "element": "gt-tracking",
                        "name": null,
                        "method": "tracking-data",
                        "config": {}
                    }
                };
                $(store).on("tracking-data-changed", ({ detail }) => {
                    console.log(detail);
                    let active = store.getData("active") || {};
                    const data = detail.reduce((data, unit) => {
                        data[unit.unitId] = unit;
                        return data;
                    }, {});
                    active = Object.assign(active, data);
                    store.updateData("active", active);
                    const unit = store.getItem("unit");
                    if (unit && data[unit.unitId]) {
                        store.updateItem("unit", Object.assign(unit, data[unit.unitId]));
                    }
                });
            }
        });
    }
    getStore() {
        return document.querySelector(`gt-unit-store`);
    }
}
customElements.define("gt-tracking", GTTracking);
//# sourceMappingURL=GTTracking.js.map