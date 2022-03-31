var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _MapBox_config, _MapBox_map;
import { loadScript } from "./LoadScript.js";
export class MapBox extends HTMLElement {
    constructor() {
        super();
        this.apiKey = "AIzaSyBhPsH8OjHCypjgwt_Dl7A_W8wlBbyPink";
        this.apiUrl = "https://maps.google.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&libraries=drawing";
        this.longitude = -66.903603;
        this.latitude = 10.480594;
        _MapBox_config.set(this, {});
        _MapBox_map.set(this, null);
        return;
        const template = document.createElement("template");
        template.innerHTML = `
			
			<style>


            *,
*::before,
*::after {
	box-sizing: border-box;
}
            :host{
                
                border: 5px solid red;
                display: inline-block;
                height: 100%;
                
                width: 100%;
                
                
                
            }
           
            </style>
			
			<slot></slot>

		`;
        //this.attachShadow({ mode: "open" });
        //this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    static loadApiFile() {
        return new Promise((resolve, reject) => {
            const key = "AIzaSyBhPsH8OjHCypjgwt_Dl7A_W8wlBbyPink";
            const url = "https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.js";
            loadScript(url, true)
                .then(message => {
                console.log(message);
                MapBox.scriptLoaded = true;
                mapboxgl.accessToken = "pk.eyJ1IjoieWFubnkyNCIsImEiOiJjazYxZnM5dzMwMzk1M21xbjUyOHVmdjV0In0.4ifqDgs5_PqZd58N1DcVaQ";
                resolve({
                    status: true
                });
            })
                .catch(message => {
                MapBox.scriptLoaded = false;
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
        if (!MapBox.scriptLoaded) {
            MapBox.loadApiFile()
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
        const map = new mapboxgl.Map({
            style: 'mapbox://styles/mapbox/streets-v11',
            container: this,
            zoom: 10,
            center: [this.longitude, this.latitude],
            attributionControl: false
        });
        __classPrivateFieldSet(this, _MapBox_map, map, "f");
        //this.onLoad(map);;
    }
    attributeChangedCallback(name, oldVal, newVal) {
    }
    connectedCallback() {
        this.init();
    }
}
_MapBox_config = new WeakMap(), _MapBox_map = new WeakMap();
MapBox.scriptLoaded = false;
customElements.define('map-box', MapBox);
//# sourceMappingURL=MapBox%20copy.js.map