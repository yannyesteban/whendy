import { Q as $ } from "../Q.js";
import  * as Tool from "../Tool.js";
import {WHGrid} from "../WHGrid";
import { GTUnitStore } from "./GTUnitStore.js";

export class GTConnectedInfo extends HTMLElement {

	_win = null;
	_menu = null;

	static get observedAttributes() {
		return [""];
	}


	constructor() {
		super();

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

		this._click = this._click.bind(this);
		this._unitsChange = this._unitsChange.bind(this);

		console.log("connectedCallback");
	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
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
		return Tool.getParentElement(this, "wh-app");
	}

	set dataSource(source) {

		console.log(source);

		this.units = source.units;
		customElements.whenDefined("wh-win").then(()=>{
			const win = $.create("wh-win");
			const header = win.create("wh-win-header");
			
			win.prop(source.win);

			header.create("wh-win-caption").html(this.caption);

			win.get().style.position = "fixed";
			const body = win.create("wh-win-body");

			$(this).append(win);
			this._win = win.get();

			this.createGrid(body);

			Tool.whenApp(this).then((app)=>{
				console.log(8)
				$(app).on("tracking-data-changed",  this._unitsChange);
				
			});
	
		});
	}

	getStore(): GTUnitStore {
		return document.querySelector(`gt-unit-store`);
	}

	set show(value){
		if(this._win){
			this._win.visibility = (value)?"visible":"hidden"
		}
	}

	createGrid(body){
		customElements.whenDefined("wh-grid").then(e=>{
			
			const data = this.units.map(e=>  {
				return {unitId: e.unitId,
				unitName: e.unitName,
				statusName: e.statusName,
				connected: e.connected,
				deviceId: e.deviceId}
			});


			console.log(data)
			const grid = $(body).create("wh-grid").get() as WHGrid;


			grid.dataSource = {
                caption:"datos personales",
                selectMode:"",
				rowValues : ["unitId", "unitName", "connected"],
                fields:[
                    {
                        name:"unitId",
                        caption:"id",
						hiddenn: true
                    },
                    {
                        name:"unitName",
                        caption:"Unidad"
                    },
                    {
                        name:"statusName",
                        caption:"Status"
                    },
                    {
                        name:"deviceId",
                        caption:"Devide ID"
                    },
					{
						name:"connected",
						caption:"connected"
					}
                ],
                data: data

            }


			$(grid).on("grid-row-click", this._click);

		})
	}


	async _unitsChange(event:CustomEvent){
		
		console.log("detail", event.detail);

		const grid = this._getGrid();
		event.detail.forEach(unit => {
			let row = grid.querySelector(`wh-grid-row[data-unit-id="${unit.unitId}"]`);

			if(row){
				const connected = row.getAttribute("data-connected");
				console.log(connected, unit.connected, connected == unit.connected)
				if(connected == unit.connected){
					return;
				}
				row.remove();
				
			
				
			}

			row = grid.createRow(unit);

			console.log("detail",unit.connected);

			console.log(row)
			if(unit.connected){
				
				grid.appendFirst(row);
				
				return;
			}

			const temp = grid.querySelector<HTMLElement>(`wh-grid-row[data-connected="0"]`);

			if(temp){
				temp.insertAdjacentElement("afterend", row);
				return;
			}
			//grid.insertBefore(row, temp);
			grid.appendChild(row)

		});

	}

	_getGrid(){
		return this.querySelector(`wh-grid`) as WHGrid;
	}

	async _click(event) {
		
		const store = this.getStore();

		if (store) {
			store.run("load-units", {
				unitId: event.detail.data.unitId,
				visible: 1,
				active: 1

			});
		}
	}

}

customElements.define("gt-connected-info", GTConnectedInfo);