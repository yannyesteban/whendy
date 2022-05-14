import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
import "../WHTab.js";
import { GTUnitStore } from "./GTUnitStore.js";
import * as Tool from "../Tool.js";
import { WHInfo } from "../WHInfo.js";
import {WHWin} from "../WHWindow.js"

class GTUnitInfo extends HTMLElement {

	_win = null;
	_menu = null;
	_last = null;

	static get observedAttributes() {
		return [""];
	}


	constructor() {
		super();


		
        this._unitChange =  this._unitChange.bind(this);
		this._unitsChange =  this._unitsChange.bind(this);
		return;
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
		});

	}



	public connectedCallback() {

		Tool.whenApp(this).then((app)=>{
            $(app).on("unit-data-set", this._unitChange);
            $(app).on("units-data-changed",  this._unitsChange);
            
        });


	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");

        Tool.whenApp(this).then((app)=>{
            $(app).off("unit-data-set", this._unitChange);
            $(app).off("units-data-changed",  this._unitsChange);
        });
    
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");

	}

	set caption(value) {
		if (Boolean(value)) {
			this.setAttribute("caption", value);
		} else {
			this.removeAttribute("caption");
		}
	}

	get caption() {
		return this.getAttribute("caption");
	}

	public getApp() {
		return getParentElement(this, "wh-app");
	}

	set dataSource(source) {

		console.log(source);

		customElements.whenDefined("wh-win").then(() => {
			const win = $.create("wh-win");
			const header = win.create("wh-win-header");
			
			win.prop(source.win);

			header.create("wh-win-caption").html(this.caption);

			win.get().style.position = "fixed";
			//win.get().style.top = "150px";
			//win.get().style.right = "50px"
			const body = win.create("wh-win-body");

			$(this).append(win);
			this._win = win.get();
			//this._win.mode = "modal"
			

			customElements.whenDefined("wh-win").then(() => {
				const info = body.create("wh-info").get();
				
				info.template = this.template;
				
			})

		});


	}

	getStore(): GTUnitStore {
		return document.querySelector(`gt-unit-store`);
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

	set show(value){
		if(this._win){
			this._win.visibility = (value)?"visible":"hidden"
		}
	}

    _unitChange({detail}){
		this._last = detail;
		
		

		this._setData();
        
    }

	_unitsChange({detail}){
        
        console.log("detail", detail);

		if(detail.unitId){
			this._last = detail.unitId;
			this._setData();
		}
        
        
    
    }

	_setData(){
		
		const info = this.querySelector(`wh-info`) as WHInfo;
		info.mode = "ready";
		info.data = this._last;

		const caption = this.querySelector(`wh-win wh-win-caption`) as WHWin;

		caption.innerHTML = this._last.unitName;



	}

}

customElements.define("gt-unit-info", GTUnitInfo);