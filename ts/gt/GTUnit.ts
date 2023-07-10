import { Q as $ } from "../Q.js";
import { getParentElement, fire } from "../Tool.js";
import { GTUnitStore } from "./GTUnitStore.js";

class GTUnit extends HTMLElement {

	static get observedAttributes() {
		return [""];
	}

	constructor() {
		super();
	}

	public connectedCallback() { }

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");

	}

	set dataSource(source) {
		
		
		console.log(source);

		this.whenStore().then((store: GTUnitStore)=>{

			store.registerAction("load-units", (config)=>{
				return [
					{
						type:"element",
						element: "gt-unit",
						name: null,
						method: "load-units",
						config
					}
				]
			});

			$(store).on("units-data-changed", ({detail})=>{

				//console.log(detail);
				
				const active = Object.assign(store.getData("active") || {}, detail.filter(unit=>unit.visible === 1));
				store.updateData("active", active);

				//const units = Object.values(detail);
				
				const unit = detail.find(unit=>unit.active === 1);
				if(unit){
					store.updateItem("unit", unit);
				}else{
					
					const lastUnit = store.getItem("unit");

					if(lastUnit){
						detail.filter(unit=>unit.unitId === lastUnit.unitId)
						.map(unit=>{
							console.log(lastUnit);
							store.updateItem("unit", Object.assign(lastUnit, unit));
						});
					}

					
					
				}
				
				

				console.log("DATA: ", store.getData("active"));
				
			});


			
			store.registerAction("load-unit", (unitId, active?)=>{
				return [
					{
						"type":"element",
						"element": "gt-unit",
						"name": null,
						"method": "load-unit-data",
						"config": {
							unitId,
							active
						}
					}
				]
			});

			store.registerAction("load-units-status", ()=>{
				return [
					{
						"type":"element",
						"element": "gt-unit",
						"name": null,
						"method": "load-units-status",
						
					}
				]
			});

			store.run("load-units-status")

			
		}).catch(message=>{

		})

		


	}

	whenStore(){
		return new Promise((resolve, reject)=>{
			customElements.whenDefined('gt-unit-store').then(() => {
				const store: GTUnitStore = document.querySelector(`gt-unit-store`);

				if(store){
					resolve(store);
				}
				reject('error')
				
			});
		});
	}

	getStore(){
		return document.querySelector(`gt-unit-store`);
	}

	public getApp() {
		return getParentElement(this, "wh-app");
	}

	
	
	

}

customElements.define("gt-unit", GTUnit);