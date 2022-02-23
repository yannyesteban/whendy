import { loadScript } from "./LoadScript.js";


export class GTMap extends HTMLElement {
    public server = "";
    public length = 100;
    public innerHTML = "";
    public innerHtml = "";
    public apiKey = "AIzaSyBhPsH8OjHCypjgwt_Dl7A_W8wlBbyPink";
    public apiUrl = "https://maps.google.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&libraries=drawing";
    public _obj = {};

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

                })


        });




    }

    constructor() {
        super();
    }
    
    public init(message?) {

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

    public createMap() {
        
        
        const map = new google.maps.Map(this, {
            zoom: 10,
            center: { lat: this.latitude, lng: this.longitude },
        });
        

        this.#map = map;

        
        //this.onLoad(map);;
        
    }


    set obj(value){

        this._obj = value;
        console.log(this._obj)
    }

    get obj(){
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
       console.log("test from Map.ts") ;
    }
}

customElements.define('gt-map', GTMap);

window["GTMap"] = GTMap;