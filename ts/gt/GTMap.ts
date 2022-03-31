import { Q as $ } from "../Q.js";
import * as Tool from "../Tool.js";

export class GTMap extends HTMLElement {
    

    static get observedAttributes() {
        return ["api", "type"];
    }

    constructor() {
        super();

        

    }
   
      

    

    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        console.log({name, oldVal, newVal})
        switch(name){
            case "api":
                if(oldVal !== newVal){
                    //this.render();
                }
                this.render();
                break;
        }
    }
    connectedCallback() {
        console.log("connectedCallback");
        
    }

    set api(value) {

		if (Boolean(value)) {
			this.setAttribute("api", value);
		} else {
			this.removeAttribute("api");
		}

	}

	get api() {
		return this.getAttribute("api");
	}

    render(){
        console.log("render", this.api)
        
        if(this.api === "google"){
            
            customElements.whenDefined("google-maps").then(() => {
                if(this.querySelector("google-maps")){
                    return;
                }
                this.innerHTML = "";
                $(this).create("google-maps");
            });
        }

        if(this.api === "mapbox"){
            
            customElements.whenDefined("map-box").then(() => {
                if(this.querySelector("map-box")){
                    return;
                }
                this.innerHTML = "";
                $(this).create("map-box");
            });
        }
        
    }
    
    toggle(){
        if(this.api === "mapbox"){
            this.api = "google";
        }else{
            this.api = "mapbox";
        }
    }
    set dataSource(source){
        Tool.whenApp(this).then((app)=>{
            $(app).on("unit-data-changed", ({detail})=>{
                console.log(detail);
            })
        });
        this._dataSource = source;
        //this.api = "google";
        //this.render();
    }

    whenStore(){
		return new Promise((resolve, reject)=>{
			customElements.whenDefined('gt-unit-store').then(() => {
				const store = document.querySelector(`gt-unit-store`);

				if(store){
					resolve(store);
				}
				reject('error')
				
			});
		});
	}
}

customElements.define('gt-map', GTMap);