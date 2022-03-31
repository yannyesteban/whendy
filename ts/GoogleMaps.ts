import { loadScript } from "./LoadScript.js";


export class GoogleMaps extends HTMLElement {


   

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

                })


        });




    }

    static get observedAttributes() {
        return ["type"];
    }

    constructor() {
        super();
    }

    public init(message?) {

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

    public render() {


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


        this.#map = map;


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

customElements.define('google-maps', GoogleMaps);
