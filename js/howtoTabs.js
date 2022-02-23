var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GTMap_config, _GTMap_map;
import { loadScript } from "./LoadScript.js";
class GoogleMark extends HTMLElement {
    constructor() {
        super();
        this.longitude = "-66.903603";
        this.latitude = "10.480594";
        this.mapParent = null;
        this.api = null;
        this.info = null;
        this.infoWindow = null;
        this.marker = null;
        this._build = null;
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
            //console.log(nodes);
            if (this.getMapApi()) {
                this.createInfoWindow(this.getMapApi());
            }
        });
        console.log("init: google-mark");
    }
    static get observedAttributes() {
        return ["f", "latitude", "longitude"];
    }
    connectedCallback() {
        console.log("google-mark");
        this.whenMap().then(api => {
            this.createMark(api);
        }).catch(message => {
            console.warn(message);
        });
    }
    whenMap() {
        return new Promise((resolve, reject) => {
            const map = this.getMap();
            if (!map) {
                reject({
                    message: "mark not is into google map element",
                    error: true
                });
                return;
            }
            if (!map.loaded) {
                map.addEventListener("build", (this._build = (event) => {
                    resolve(event.detail.map);
                }), false);
                return;
            }
            map.removeEventListener("build", this._build);
            resolve(map.getMapApi());
        });
    }
    setMapApi(api) {
        this.api = api;
    }
    getMapApi() {
        if (this.api) {
            return this.api;
        }
        const map = this.getMap();
        if (map) {
            this.api = map.getMapApi();
        }
        return this.api;
    }
    createMark(api) {
        const latLng = {
            lat: Number.parseInt(this.latitude),
            lng: Number.parseInt(this.longitude),
        };
        const marker = new google.maps.Marker({
            position: latLng,
            map: api,
        });
        this.marker = marker;
        this.createInfoWindow(api);
    }
    createInfoWindow(api) {
        if (!this.infoWindow) {
            this.infoWindow = new google.maps.InfoWindow();
            this.marker.addListener("click", () => {
                this.infoWindow.open({
                    anchor: this.marker,
                    map: api,
                    shouldFocus: false,
                });
            });
        }
        this.infoWindow.setContent(this.innerHTML);
    }
    setInfo(text) {
        this.innerHTML = text;
        console.log(this.children);
    }
    remove() {
        if (this.marker) {
            this.marker.setMap(null);
        }
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
        this.mapParent = null;
        this.api = null;
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        this[name] = newVal;
        switch (name) {
            case "latitude":
            case "longitude":
                this.setPosition({
                    latitude: this.latitude,
                    longitude: this.longitude,
                });
        }
    }
    setMap(map) {
        this.mapParent = map;
    }
    getMap() {
        if (this.mapParent) {
            return this.mapParent;
        }
        let parentNode = null;
        let ele = this;
        do {
            parentNode = ele.parentNode;
            ele = parentNode;
        } while (parentNode !== null &&
            parentNode.tagName !== "google-map".toUpperCase());
        this.setMap(parentNode);
        return parentNode;
    }
    setPosition({ latitude, longitude }) {
        console.log("setposition 0.0");
        if (!this.marker) {
            return;
        }
        console.log("setposition");
        //this.longitude = longitude;
        //this.latitude = latitude;
        const latLng = { lat: latitude * 1, lng: longitude * 1 };
        this.marker.setPosition(latLng);
        console.log("position", latLng);
        /*
if (this.activeFollow) {
console.log("ok")
this.panTo();
}
*/
    }
}
customElements.define("google-mark", GoogleMark);
export class GTMap extends HTMLElement {
    constructor() {
        super();
        this.server = "";
        this.length = 100;
        //public innerHTML = "";
        this.innerHtml = "";
        this.apiKey = "AIzaSyBhPsH8OjHCypjgwt_Dl7A_W8wlBbyPink";
        this.apiUrl = "https://maps.google.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&libraries=drawing";
        this._obj = {};
        this.longitude = -66.903603;
        this.latitude = 10.480594;
        this.loaded = false;
        _GTMap_config.set(this, {});
        _GTMap_map.set(this, null);
        console.log("init: google-maps");
        const template = document.createElement("template");
        template.innerHTML = `
<style>
:host {

height:100%;
}
#map{
height:100%;
}
::slotted(div) {
border:red solid 3px;
}
</style>
<div id="map"></div>
<slot></slot>
<slot name="panel"></slot>
<slot name="mark"></slot>
`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.mapContainer = this.shadowRoot.getElementById("map");
        this._slot = this.shadowRoot.querySelector("slot");
        const slots = this.shadowRoot.querySelectorAll("slot");
        this._slot.addEventListener("slotchange", (e) => {
            const nodes = this._slot.assignedNodes();
            console.log(`Element in Slot "${this._slot.name}" changed to "${this._slot.outerHTML}".`);
        });
        this.init();
        /*
this.addEventListener("DOMNodeInserted", (ev) => {
console.log(ev)
}, false);
*/
    }
    static loadApiFile() {
        return new Promise((resolve, reject) => {
            const key = "AIzaSyBhPsH8OjHCypjgwt_Dl7A_W8wlBbyPink";
            const url = "https://maps.google.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&libraries=drawing";
            loadScript(url, true)
                .then((message) => {
                console.log(message);
                GTMap.scriptLoaded = true;
                resolve({
                    status: true,
                });
            })
                .catch((message) => {
                GTMap.scriptLoaded = false;
                reject({
                    status: true,
                });
            });
        });
    }
    init(message) {
        if (!GTMap.scriptLoaded) {
            GTMap.loadApiFile()
                .then(() => {
                this.createMap();
            })
                .catch(() => {
                alert("error");
            });
            return;
        }
        this.createMap();
    }
    createMap() {
        const map = new google.maps.Map(this.mapContainer, {
            zoom: 10,
            center: {
                lat: this.latitude,
                lng: this.longitude,
            },
        });
        __classPrivateFieldSet(this, _GTMap_map, map, "f");
        const event = new CustomEvent("build", {
            detail: {
                map,
            },
        });
        // Dispatch the event.
        this.loaded = true;
        this.dispatchEvent(event);
        //this.onLoad(map);;
    }
    getMapApi() {
        return __classPrivateFieldGet(this, _GTMap_map, "f");
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
            this.setAttribute("man", "x");
        else
            this.removeAttribute("man");
    }
    get man() {
        return this.hasAttribute("man");
    }
    static get observedAttributes() {
        return ["server", "length", "innerHtml"];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }
    connectedCallback() {
        console.log("google-map");
        //console.log(this.innerHtml);
        //this.style.height = "100%";
        this.style.display = "block";
        //this.innerHTML = this.innerHtml+this.length;
        //this.innerHTML = `hola es un Map con ${this.length}...!!!`;
        //this.shadowRoot.appendChild(document.createElement("slot"));
    }
    test() {
        console.log("test from Map.ts");
    }
}
_GTMap_config = new WeakMap(), _GTMap_map = new WeakMap();
GTMap.scriptLoaded = false;
customElements.define("google-map", GTMap);
window["GTMap"] = GTMap;
const template = document.createElement("template");
template.innerHTML = `
<style>
:host {
display: flex;
flex-wrap: wrap;
}
::slotted(howto-panel) {
flex-basis: 100%;
}
</style>
<slot name="tab"></slot>
<slot name="panel"></slot>
`;
customElements.define("howto-tabs", class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
});
//# sourceMappingURL=howtoTabs.js.map