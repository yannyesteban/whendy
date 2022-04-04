import { Q as $ } from "../Q.js";
import * as Tool from "../Tool.js";
export class GTMap extends HTMLElement {
    constructor() {
        super();
        this._api = null;
        this._data = {};
        this.popupTemplate = "";
        this._unitsChange = this._unitsChange.bind(this);
        this._unitChange = this._unitChange.bind(this);
    }
    static get observedAttributes() {
        return ["api", "type"];
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
        Tool.whenApp(this).then((app) => {
            $(app).off("unit-data-changed", this._unitChange);
            $(app).off("units-data-changed", this._unitsChange);
        });
    }
    connectedCallback() {
        console.log("connectedCallback");
        Tool.whenApp(this).then((app) => {
            $(app).on("unit-data-changed", this._unitChange);
            $(app).on("units-data-changed", this._unitsChange);
        });
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        console.log({ name, oldVal, newVal });
        switch (name) {
            case "api":
                if (oldVal !== newVal) {
                    //this.render();
                }
                this.render();
                break;
        }
    }
    _unitsChange({ detail }) {
        console.log(detail);
        for (let x in detail) {
            this.mark = detail[x];
        }
    }
    _unitChange({ detail }) {
        console.log(detail);
    }
    set api(value) {
        if (Boolean(value)) {
            this.setAttribute("api", value);
        }
        else {
            this.removeAttribute("api");
        }
    }
    get api() {
        return this.getAttribute("api");
    }
    set mark(info) {
        console.log(info, this._api);
        console.log({
            latitude: info.latitude,
            longitude: info.longitude,
            heading: info.heading,
            name: info.unitName,
            image: info.image,
            visible: info.visible ? true : false,
            follow: info.follow ? true : false,
            trace: info.trace ? true : false,
            info: info,
        });
        this._api.mark = {
            latitude: info.latitude,
            longitude: info.longitude,
            heading: info.heading,
            name: info.unitName,
            icon: info.image,
            visible: info.visible ? true : false,
            follow: info.follow ? true : false,
            trace: info.trace ? true : false,
            innerHTML: this.popupTemplate,
            info: info,
        };
    }
    render() {
        console.log("render", this.api);
        if (this.api === "google") {
            customElements.whenDefined("google-maps").then(() => {
                if (this.querySelector("google-maps")) {
                    return;
                }
                this.innerHTML = "";
                this._api = $(this).create("google-maps").get();
            });
        }
        if (this.api === "mapbox") {
            customElements.whenDefined("mapbox-maps").then(() => {
                if (this.querySelector("mapbox-maps")) {
                    return;
                }
                this.innerHTML = "";
                this._api = $(this).create("mapbox-maps").get();
            });
        }
    }
    toggle() {
        if (this.api === "mapbox") {
            this.api = "google";
        }
        else {
            this.api = "mapbox";
        }
    }
    set dataSource(source) {
        //console.log(source)
        this._dataSource = source;
        //this.api = "google";
        //this.render();
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
}
customElements.define('gt-map', GTMap);
//# sourceMappingURL=GTMap.js.map