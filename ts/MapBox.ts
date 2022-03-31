import { loadScript } from "./LoadScript.js";


export class MapBox extends HTMLElement {


   

    public apiKey = "AIzaSyBhPsH8OjHCypjgwt_Dl7A_W8wlBbyPink";
    public apiUrl = "https://maps.google.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&libraries=drawing";


    public longitude: number = -66.903603;
    public latitude: number = 10.480594;

    #config = {};
    #map = null;

    static scriptLoaded = false;


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

                })


        });




    }

    static get observedAttributes() {
        return ["type"];
    }

    constructor() {
        super();

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

    public init(message?) {

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

    public render() {


        const map = new mapboxgl.Map({
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            container: this,
            zoom: 10,
            center: [this.longitude, this.latitude],
            attributionControl: false
        });


        this.#map = map;


        //this.onLoad(map);;

    }








    attributeChangedCallback(name, oldVal, newVal) {

    }
    connectedCallback() {

        
        this.init();


    }


}

customElements.define('map-box', MapBox);
