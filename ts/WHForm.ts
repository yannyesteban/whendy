import { Q as $ } from "./Q.js";
import { getParentElement } from "./Tool.js";
class WHField extends HTMLElement {
	constructor() {
		super();
		//this.slot = "field";

		const template = document.createElement("template");

		template.innerHTML = `
			
		<link rel="stylesheet" href="./../css/WHHeader1.css">
			
		<slot name="label"></slot>
		<slot name="input"></slot>
		
		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
}
customElements.define("wh-field", WHField);

class WHForm extends HTMLElement {
	static formAssociated = true;
	_internals = null;
	public _data = {};
	constructor() {
		super();
		this._internals = this.attachInternals();
		const template = document.createElement("template");

		template.innerHTML = `
<style>
  :host {
    display:block;
    border:2px solid green;
    
  }

  :host:not(:defined) {
    
    
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

	static get observedAttributes() {
		return ["f", "latitude", "longitude"];
	}

	public get data(){
		return this._data;
	}
	public set data(value){
		
		
		
		const form = $(this);

		
		const caption = form.create("caption").html(value.caption);
		
		value.fields.forEach(field=>{
			
			const f = $.create("wh-field");
			f.create("span").html(field.label).attr("slot","label");
			f.create("input").attr({"type": field.type, "slot":"input", name:field.name});
			form.append(f);
			
			
		});
		const nav = form.create("div");
		
		
		value.nav.items.forEach(item=>{
			const button = nav.create("button").attr("type", "button").html(item.caption+"..");
			if(item.send){
				button.on("click", (evenet)=>{
					const app = this.getApp();
					if(app){
						item.send.data = this.getValues();
						
						app.go(item.send)
					}
					
				});
			}

		})

	}

	public getValues(){
		const inputs = this.querySelectorAll(`input, select, textarea, img, button`);
		const data = {};
		inputs.forEach((e:HTMLInputElement)=>{
			if(e.name){
				data[e.name] = e.value;  
			}
			
		});
		console.log(data);
		return data;
	}
	public connectedCallback() {
		console.log("two")

		//const yy = document.createElement("wh-field");
		//const yy2 = new WHField;
		//yy.innerHTML = "yanny";
		//this.appendChild(yy);
	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");
		this[name] = newVal;
	}

	public getApp(){
		return getParentElement(this, "wh-app");
	}
	
}

customElements.define("wh-form", WHForm);