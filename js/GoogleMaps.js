var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _GoogleMaps_config, _GoogleMaps_map;
import { loadScript } from "./LoadScript.js";
export class GoogleMaps extends HTMLElement {
    constructor() {
        super();
        this.apiKey = "AIzaSyBhPsH8OjHCypjgwt_Dl7A_W8wlBbyPink";
        this.apiUrl = "https://maps.google.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&libraries=drawing";
        this.longitude = -66.903603;
        this.latitude = 10.480594;
        _GoogleMaps_config.set(this, {});
        _GoogleMaps_map.set(this, null);
    }
    static loadApiFile() {
        return new Promise((resolve, reject) => {
            const key = "AIzaSyBhPsH8OjHCypjgwt_Dl7A_W8wlBbyPink";
            const url = "https://maps.google.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&libraries=drawing";
            loadScript(url, true)
                .then(message => {
                console.log(message);
                GoogleMaps.scriptLoaded = true;
                resolve({
                    status: true
                });
            })
                .catch(message => {
                GoogleMaps.scriptLoaded = false;
                reject({
                    status: true
                });
            });
        });
    }
    static get observedAttributes() {
        return ["type"];
    }
    init(message) {
        if (!GoogleMaps.scriptLoaded) {
            GoogleMaps.loadApiFile()
                .then(() => {
                this.render();
            }).catch(() => {
                alert("error");
            });
            return;
        }
        this.render();
    }
    render() {
        const map = new google.maps.Map(this, {
            zoom: 10,
            center: { lat: this.latitude, lng: this.longitude },
            disableDefaultUI: true,
            //zoomControl: true,
            //mapTypeControl: true,
            //scaleControl: true,
            //streetViewControl: true,
            //rotateControl: true,
            fullscreenControl: true
        });
        __classPrivateFieldSet(this, _GoogleMaps_map, map, "f");
        //this.onLoad(map);;
    }
    attributeChangedCallback(name, oldVal, newVal) {
    }
    connectedCallback() {
        this.style.height = "100%";
        this.style.width = "100%";
        this.style.display = "block";
        this.init();
    }
}
_GoogleMaps_config = new WeakMap(), _GoogleMaps_map = new WeakMap();
GoogleMaps.scriptLoaded = false;
customElements.define('google-maps', GoogleMaps);
//# sourceMappingURL=GoogleMaps.js.map