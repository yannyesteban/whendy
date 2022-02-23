var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _GTMap_config, _GTMap_map;
import { loadScript } from "./LoadScript.js";
export class GTMap extends HTMLElement {
    constructor() {
        super();
        this.server = "";
        this.length = 100;
        this.innerHTML = "";
        this.innerHtml = "";
        this.apiKey = "AIzaSyBhPsH8OjHCypjgwt_Dl7A_W8wlBbyPink";
        this.apiUrl = "https://maps.google.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&libraries=drawing";
        this._obj = {};
        this.longitude = -66.903603;
        this.latitude = 10.480594;
        _GTMap_config.set(this, {});
        _GTMap_map.set(this, null);
    }
    static loadApiFile() {
        return new Promise((resolve, reject) => {
            const key = "AIzaSyBhPsH8OjHCypjgwt_Dl7A_W8wlBbyPink";
            const url = "https://maps.google.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&libraries=drawing";
            loadScript(url, true)
                .then(message => {
                console.log(message);
                GTMap.scriptLoaded = true;
                resolve({
                    status: true
                });
            })
                .catch(message => {
                GTMap.scriptLoaded = false;
                reject({
                    status: true
                });
            });
        });
    }
    init(message) {
        if (!GTMap.scriptLoaded) {
            GTMap.loadApiFile()
                .then(() => {
                this.createMap();
            }).catch(() => {
                alert("error");
            });
            return;
        }
        this.createMap();
    }
    createMap() {
        const map = new google.maps.Map(this, {
            zoom: 10,
            center: { lat: this.latitude, lng: this.longitude },
        });
        __classPrivateFieldSet(this, _GTMap_map, map, "f");
        //this.onLoad(map);;
    }
    set obj(value) {
        this._obj = value;
        console.log(this._obj);
    }
    get obj() {
        return this._obj;
    }
    set man(value) {
        const isChecked = Boolean(value);
        if (isChecked)
            this.setAttribute('man', 'x');
        else
            this.removeAttribute('man');
    }
    get man() {
        return this.hasAttribute('man');
    }
    static get observedAttributes() {
        return ['server', 'length', 'innerHtml'];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }
    connectedCallback() {
        console.log(this.innerHtml);
        this.style.height = "100%";
        this.style.display = "block";
        this.init();
        //this.innerHTML = this.innerHtml+this.length;
        //this.innerHTML = `hola es un Map con ${this.length}...!!!`;
    }
    test() {
        console.log("test from Map.ts");
    }
}
_GTMap_config = new WeakMap(), _GTMap_map = new WeakMap();
GTMap.scriptLoaded = false;
customElements.define('gt-map', GTMap);
window["GTMap"] = GTMap;
//# sourceMappingURL=GTMap.js.map