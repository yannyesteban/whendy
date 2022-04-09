import { Q as $ } from "../Q.js";
import * as Tool from "../Tool.js";
import { GTUnitStore } from "./GTUnitStore.js";

export class GTMap extends HTMLElement {
    
    _api = null;
    _data = {}

    _bounds = null;
    _center = {
        latitude: 10.480594,
        longitude: -66.903603
    } 
    
    popupTemplate = "";
    static get observedAttributes() {
        return ["api", "type"];
    }

    constructor() {
        super();

        this._unitsChange =  this._unitsChange.bind(this);
        this._unitChange =  this._unitChange.bind(this);

    }
    
    disconnectedCallback() {
        console.log("disconnectedCallback");

        Tool.whenApp(this).then((app)=>{
            $(app).off("unit-data-set", this._unitChange);
            $(app).off("units-data-changed",  this._unitsChange);
        });
    }

    connectedCallback() {
        console.log("connectedCallback");

        Tool.whenApp(this).then((app)=>{
            $(app).on("unit-data-set", this._unitChange);
            $(app).on("units-data-changed",  this._unitsChange);
        });
        
        
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

    _unitsChange({detail}){
        
        console.log(detail);
        for(let x in detail){
            this.mark = detail[x];
        }
        
    
    }

    _unitChange({detail}){

        if(detail.active){
            console.log("ACTIVE");
            this.flyTo(detail.unitName);
        }
        console.log(detail);
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

    set mark(info){
        console.log(info, this._api)


        console.log({
            latitude:info.latitude,
            longitude:info.longitude,
            heading:info.heading,
            name:info.unitName,
            image:info.image,
            visible:info.visible? true: false,
            follow:info.follow? true: false,
            trace:info.trace? true: false,
            info:info,
        });
        this._api.mark = {
            latitude:info.latitude,
            longitude:info.longitude,
            heading:info.heading,
            name:info.unitName,
            icon:info.image,
            visible:info.visible? true: false,
            follow:info.follow? true: false,
            trace:info.trace? true: false,
            innerHTML: this.popupTemplate, 
            info:info,
        };
    }
    render(){
        console.log("render A");
        


        console.log("render", this.api)

        const bounds = this.getBounds();
        const center = this.getCenter() || this._center;
        const zoom = this.getZoom() || 10;
        //console.log(center)
        if(this.api === "google"){
            
            
            customElements.whenDefined("google-maps").then(() => {
                if(this.querySelector("google-maps")){
                    return;
                }
                this.innerHTML = "";
                this._api = $.create("google-maps").get();

                this._api.latitude = center.latitude;
                this._api.longitude = center.longitude;
                this._api.zoom = zoom*1.01;
                
                this._api.addEventListener("api-load", event=>{
                   
                    this.whenStore().then((store:GTUnitStore)=>{

                        const data = store.getData("active");
                        console.log(data)
                        for(let x in data){
                            this.mark = data[x];
                        }
                    });

                    if(bounds){
                        //this._api.fitBounds(bounds);
                    }
                });

                this.append(this._api);

                
            });
        }

        if(this.api === "mapbox"){
            
            customElements.whenDefined("mapbox-maps").then(() => {
                if(this.querySelector("mapbox-maps")){
                    return;
                }
                this.innerHTML = "";
                this._api = $.create("mapbox-maps").get();
               
                this._api.latitude = center.latitude;
                this._api.longitude = center.longitude;
                this._api.zoom = zoom;

                this._api.addEventListener("api-load", event=>{
                    this.whenStore().then((store:GTUnitStore)=>{

                        const data = store.getData("active");
                        console.log(data)
                        for(let x in data){
                            this.mark = data[x];
                        }
                    });

                    if(bounds){
                        //this._api.fitBounds(bounds);
                    }
                });
                
                this.append(this._api);
                
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
        //console.log(source)
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

    public flyTo(name) {
        console.log(name);
        const mark =  this.getMark(name);
        console.log(mark);
        if(mark){
            mark.flyTo(16);
        }

    }

    panTo(name){
        console.log(name);
        const mark =  this.getMark(name);
        console.log(mark);
        if(mark){
            mark.panTo();
        }
        
    }

    getMark(name){
        return this._api.querySelector(`[role="mark"][name="${name}"]`);
    }

    getApi(){
        return this._api;
    }

    getCenter(){
        if(this.getApi()){
            return this.getApi().getCenter();
        }

        return null;
    }

    getBounds(){
        if(this.getApi()){
            return this.getApi().getBounds();
        }

        return null;
    }

    fitBounds(bounds){
        if(this.getApi()){
            return this.getApi().setBounds(bounds);
        }
    }

    getZoom() {
        if(this.getApi()){
            return this.getApi().getZoom();
        }
        
        return null;
    }

    setZoom(zoom) {
        if(this.getApi()){
            return this.getApi().setZoom(zoom);
        }
        
        return null;
    }


}

customElements.define('gt-map', GTMap);