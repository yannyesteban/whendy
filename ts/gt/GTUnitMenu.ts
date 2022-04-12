import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
import "../WHTab.js";
import { GTUnitStore } from "./GTUnitStore.js";

class GTUnitMenu extends HTMLElement {

	_win = null;


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

	static get observedAttributes() {
		return [];
	}

	public connectedCallback() {




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

	test() {
		alert("test")
	}

	public getApp() {
		return getParentElement(this, "wh-app");
	}

	set dataSource(source) {

		console.log(source);

		const win = $.create("wh-win");
			const header = win.create("wh-win-header");
			
			win.prop(source.win);

			header.create("wh-win-caption").html(this.caption);

			win.get().style.position = "fixed";
			const body = win.create("wh-win-body");

			$(this).append(win);
			this._win = win.get();


		//body.html("yanny esteban");

		const menu = body.create("wh-menu");

		customElements.whenDefined('wh-menu').then(() => {
			menu.get()["dataSource"] = {
				items: source.unitData,
				hideCheck: false,
				checkbox: true,
				hideIcon: false,
				events: {
					"link-action": (event => {
						const item = $(event.target);

						if (item.hasClass("unit")) {
							console.log(event.target.value)
							//this.getStore().getUnitData(event.target.value)
							//this.getStore().run("load-unit", event.target.value, 1)
							const store = this.getStore();

							if (store) {
								store.run("load-units", {
									unitId: event.target.value,
									visible: 1,
									active: 1

								});

								console.log(store.getItem("units"))
							}


						}

					}),
					"link-check": (event => {
						const item = $(event.target);
						const store = this.getStore();

						if (item.hasClass("client")) {
							console.log(event.target.value)
							if (store) {
								store.run("load-units", {
									clientId: event.target.value,
									visible: event.target.checked,
									active: 0

								});
							}

							const childs = item.queryAll(`:scope wh-menu-item.account`);


							childs.forEach(e => {
								e.attr("checked", event.target.checked);
							})
						};

						if (item.hasClass("account")) {
							console.log(event.target.value)
							if (store) {
								store.run("load-units", {
									accountId: event.target.value,
									visible: event.target.checked,
									active: 0

								});
							}
						};


						if (item.hasClass("unit")) {
							console.log(event.target.checked)

							if (store) {
								store.run("load-units", {
									unitId: event.target.value,
									visible: event.target.checked,
									active: 0

								});
							}
							
						}

					})
				}
			};
			console.log({
				items: source.unitData
			})

			menu.on("link-check", (event) => {
				console.log(event.target)
			})

		});

		customElements.whenDefined('gt-unit-store').then(() => {
			const store = this.getStore() as GTUnitStore;
			console.log(store)
			$(store).on("unit-data-changed", ({ detail }) => {
				console.log(detail)

				const item = this.getUnitItem(detail.unitId);
				if (item) {
					item.checked = detail.visible;
				}
				else {
					console.log("error")
				}

			});

			$(store).on("units-data-changed", ({ detail }) => {
				console.log(detail)

				console.log(store.getItem("unit"));
				//console.log(Object.values(detail))
				//const units = Object.values(detail);//.filter(unit=>unit.visible === 1);
				//console.log(units)
				detail.forEach(unit => {
					//console.log(unit)
					const item = this.getUnitItem(unit.unitId);
					if (item) {
						//console.log(unit.visible)
						item.checked = unit.visible
					}
					else {
						console.log("error")
					}
				})



			});



			

		});




	}

	getUnitItem(id) {
		return this.querySelector(`wh-menu wh-menu-item.unit[value="${id}"]`);
	}

	getStore(): GTUnitStore {
		return document.querySelector(`gt-unit-store`);
	}

	set show(value){
		if(this._win){
			this._win.visibility = (value)?"visible":"hidden"
		}
	}

}

customElements.define("gt-unit-menu", GTUnitMenu);