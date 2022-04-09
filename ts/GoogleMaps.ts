import { loadScript } from "./LoadScript.js";
import { Q as $ } from "./Q.js";
import { getParentElement, fire } from "./Tool.js";

class GoogleMark extends HTMLElement {
    _marker = null;
    _infowindow = null;
    _popup = null;
    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
            <style>
            :host {
            }

            slot{
                display:none;
            }
            </style>
            <slot></slot>

        `;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const slot = this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedElements();
            //this._infowindow.setContent(this.innerHTML);
        });
    }

    static get observedAttributes() {
        return [
            "latitude",
            "longitude",
            "heading",
            "image",
            "icon",
            "info",
            "visible",
            "follow",
        ];
    }

    public connectedCallback() {
        const latLng = { lat: Number(this.latitude), lng: Number(this.longitude) };

        this.setAttribute("role", "mark");

        this._marker = new google.maps.Marker({
            position: latLng,
            map: this.getMapApi(),
        });

        this._infowindow = new google.maps.InfoWindow();

        this._marker.addListener("click", () => {
            this._infowindow.open({
                anchor: this._marker,
                map: this.getMapApi(),
                shouldFocus: false,
            });
        });
    }

    public disconnectedCallback() {
        console.log("disconnectedCallback");

        this._marker.setMap(null);
    }

    public attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");

        console.log({ name, oldVal, newVal });

        switch (name) {
            case "latitude":
                this._setPosition();
                break;
            case "longitude":
                this._setPosition();
                break;
            case "heading":
                this._setIcon();
                break;

            case "image":
                break;

            case "icon":
                this._setIcon();
                break;

            case "visible":
                this._visible();
                break;

            case "trace":
                break;

            case "follow":
                break;
        }
    }

    set icon(value) {
        if (Boolean(value)) {
            this.setAttribute("icon", value);
        } else {
            this.removeAttribute("icon");
        }
    }

    get icon() {
        return this.getAttribute("icon");
    }

    set name(value) {
        if (Boolean(value)) {
            this.setAttribute("name", value);
        } else {
            this.removeAttribute("name");
        }
    }

    get name() {
        return this.getAttribute("name");
    }

    set heading(value) {
        if (Boolean(value)) {
            this.setAttribute("heading", value);
        } else {
            this.removeAttribute("heading");
        }
    }

    get heading() {
        return this.getAttribute("heading");
    }

    set latitude(value) {
        this.setAttribute("latitude", value);
    }

    get latitude() {
        return this.getAttribute("latitude");
    }

    set longitude(value) {
        this.setAttribute("longitude", value);
    }

    get longitude() {
        return this.getAttribute("longitude");
    }

    set width(value) {
        if (Boolean(value)) {
            this.setAttribute("width", value);
        } else {
            this.removeAttribute("width");
        }
    }

    get width() {
        return this.getAttribute("width");
    }

    set height(value) {
        if (Boolean(value)) {
            this.setAttribute("height", value);
        } else {
            this.removeAttribute("height");
        }
    }

    get height() {
        return this.getAttribute("height");
    }

    set scale(value) {
        if (Boolean(value)) {
            this.setAttribute("scale", value);
        } else {
            this.removeAttribute("scale");
        }
    }

    get scale() {
        return this.getAttribute("scale");
    }

    set visible(value) {
        if (Boolean(value)) {
            this.setAttribute("visible", "");
        } else {
            this.removeAttribute("visible");
        }
    }

    get visible() {
        return this.hasAttribute("visible");
    }

    get follow() {
        return this.hasAttribute("follow");
    }

    set follow(value) {
        if (Boolean(value)) {
            this.setAttribute("follow", "");
        } else {
            this.removeAttribute("follow");
        }
    }

    get trace() {
        return this.hasAttribute("trace");
    }

    set trace(value) {
        if (Boolean(value)) {
            this.setAttribute("trace", "");
        } else {
            this.removeAttribute("trace");
        }
    }

    _visible() {
        if (!this.visible) {
        }
    }
    set mark(info) { }

    public getMap(): GoogleMaps {
        //const map = getParentElement(this, "google-maps");

        return getParentElement(this, "google-maps");
    }

    public getMapApi() {
        const map = this.getMap();
        if (map) {
            return map.getApi();
        }

        return null;
    }

    set info(data) {
        console.log(data);
        const popup = document.createElement("wh-info");
        popup.innerHTML = this.innerHTML;
        popup.data = data;
        this._infowindow.setContent(popup);
    }

    set update(info) {
        for (let x in info) {
            this[x] = info[x];
        }
    }

    _setPosition() {
        //this.longitude = longitude;
        //this.latitude = latitude;
        const latLng = { lat: Number(this.latitude), lng: Number(this.longitude) };
        this._marker.setPosition(latLng);
        console.log("position", latLng);
        return;
        if (this.activeFollow) {
            console.log("ok");
            //this.panTo();
        }
    }

    _setIcon() {
        const width = Number(this.width) || 10;
        const height = Number(this.height) || 10;

        console.log({ width, height });

        console.log("heading", this.heading);
        const icon = {
            path: `M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759
            c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z
             M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713
            v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336
            h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z`,
            fillColor: "#d00000",
            fillOpacity: 1.0,
            strokeWeight: 0,
            strokeDasharray: 4,
            rotation: Number(this.heading),

            scale: 0.6,
            anchor: new google.maps.Point(20, 20),
        };

        if (this._marker) {
            this._marker.setIcon(icon);
        }
    }

    panTo() {
        const map = this.getMap();
        if (map) {
            map.panTo({
                latitude: Number(this.latitude),
                longitude: Number(this.longitude),
            });
        }
    }

    flyTo(zoom: number) {
        const map = this.getMap();
        if (map) {
            map.flyTo({
                latitude: Number(this.latitude),
                longitude: Number(this.longitude),
                zoom,
            });
        }
    }
}

customElements.define("google-mark", GoogleMark);

export class GoogleMaps extends HTMLElement {
    public apiKey = "AIzaSyBhPsH8OjHCypjgwt_Dl7A_W8wlBbyPink";
    public apiUrl =
        "https://maps.google.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&libraries=drawing";

    //public longitude: number = -66.903603;
    //public latitude: number = 10.480594;

    #config = {};
    #map = null;

    static scriptLoaded = false;

    static loadApiFile() {
        return new Promise((resolve, reject) => {
            const key = "AIzaSyBhPsH8OjHCypjgwt_Dl7A_W8wlBbyPink";
            const url =
                "https://maps.google.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&libraries=drawing";

            loadScript(url, true)
                .then((message) => {
                    console.log(message);

                    GoogleMaps.scriptLoaded = true;
                    resolve({
                        status: true,
                    });
                })
                .catch((message) => {
                    GoogleMaps.scriptLoaded = false;
                    reject({
                        status: true,
                    });
                });
        });
    }

    static get observedAttributes() {
        return ["type"];
    }

    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
            <style>
            :host {
            }
            </style>
            <slot></slot>

        `;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        const slot = this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", (e) => {
            console.log(888);
            //const nodes = slot.assignedNodes();
        });
    }

    connectedCallback() {
        console.log("connectedCallback");

        this.style.height = "100%";
        this.style.width = "100%";
        this.style.display = "block";
        this.init();
    }

    public disconnectedCallback() {
        console.log("disconnectedCallback");
    }

    attributeChangedCallback(name, oldVal, newVal) { }

    set latitude(value) {
        this.setAttribute("latitude", value);
    }

    get latitude() {
        return this.getAttribute("latitude");
    }


    set longitude(value) {
        this.setAttribute("longitude", value);
    }

    get longitude() {
        return this.getAttribute("longitude");
    }

    set zoom(value) {
        this.setAttribute("zoom", value);
    }

    get zoom() {
        return this.getAttribute("zoom");
    }
    
    public init(message?) {
        if (!GoogleMaps.scriptLoaded) {
            GoogleMaps.loadApiFile()
                .then(() => {
                    this.render();
                })
                .catch(() => {
                    alert("error");
                });
            return;
        }

        this.render();
    }

    public render() {
        const map = new google.maps.Map(this, {
            zoom: (Number(this.zoom) || 10),
            center: { lat: Number(this.latitude), lng: Number(this.longitude) },
            disableDefaultUI: true,
            //zoomControl: true,
            //mapTypeControl: true,
            //scaleControl: true,
            //streetViewControl: true,
            //rotateControl: true,
            fullscreenControl: false,
        });

        this.#map = map;
        console.log(".......api-load............")
        fire(this, "api-load", {});
        //this.onLoad(map);;
    }

    set mark(info) {
        console.log(info);
        let mark = $(this.getMark(info.name));
        if (!mark) {
            if (!info.visible) {
                return;
            }

            mark = $(this).create("google-mark");
        }

        if (!info.visible) {
            mark.remove();
            return;
        }

        mark.prop("update", info);
    }

    getMark(name) {
        return this.querySelector(`google-mark[name="${name}"]`);
    }

    getApi() {
        return this.#map;
    }

    public panTo(position) {
        const latLng = { lat: position.latitude, lng: position.longitude };
        this.getApi().panTo(latLng);
    }

    public flyTo(info) {
        const latLng = { lat: info.latitude, lng: info.longitude };
        this.getApi().panTo(latLng);
        this.setZoom(info.zoom);
    }

    

    getCenter() {
        const center = this.getApi().getCenter().toJSON();

        return {
            latitude: center.lat,
            longitude: center.lng,
        };
    }

    getBounds() {
        return this.getApi().getBounds().toJSON();
    }

    fitBounds(bounds) {
        this.getApi().fitBounds(bounds);
    }

    getZoom() {
        return this.getApi().getZoom();
    }

    setZoom(zoom: number) {
        this.getApi().setZoom(zoom);

        /*
        const bounds = google.maps.LatLngBoundsLiteral = {
            north: 10.50941146023254,
            south: 10.496288400459798,
            east: -66.83816550256347,
            west: -66.85996649743652
          }
          */
        //const  southWest = new google.maps.LatLng({ lat: 10.496288400459798, lng:  -66.85996649743652 });
        //const northEast = new google.maps.LatLng({ lat: 10.50941146023254, lng: -66.83816550256347});

        //const  southWest = new google.maps.LatLng(10.496288400459798, -66.85996649743652);
        //const northEast = new google.maps.LatLng(10.50941146023254, -66.83816550256347);

        //var bounds = new google.maps.LatLngBounds({sw: southWest, ne: northEast});
    }

    
}

customElements.define("google-maps", GoogleMaps);
