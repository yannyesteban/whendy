import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
import "../WHTab.js";

import { WHTab } from "../WHTab.js";
import { ListText } from "../ListText.js";
import "../ListText.js";
import { WHForm } from "../WHForm.js";
import { WHWin } from "../WHWindow.js";
import { GTUnitStore } from "./GTUnitStore.js";
import { GTSocket } from "./GTSocket.js";

class GTProtoForm extends HTMLElement {
	_win = null;
	_menu = null;

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

	set unitId(value) {
		if (Boolean(value)) {
			this.setAttribute("unit-id", value);
		} else {
			this.removeAttribute("unit-id");
		}
	}

	get unitId() {
		return this.getAttribute("unit-id");
	}

	set unitName(value) {
		if (Boolean(value)) {
			this.setAttribute("unit-name", value);
		} else {
			this.removeAttribute("unit-name");
		}
	}

	get unitName() {
		return this.getAttribute("unit-name");
	}

	public getApp() {
		return getParentElement(this, "wh-app");
	}

	set commnad(info) {
		const form = new WHForm();
	}

	set dataSource(source) {
		console.log(source);

		this._createForm(source, source.mode, null);
	}

	_createForm(source, mode, index) {
		if (index === null || index === undefined) {
			index = 0;
		}


		console.log(source, "....");
		this.innerHTML = "";
		const form = $(this).create("wh-form").get() as WHForm;

		let values = [];

		if(source.last){
			values = source.values;
		}else if (source._mode == "2") {
			values = source.params;
		}

		//const values = ["yan", "este", "nun", "jim", "alb", "x1", "x2"];

		let indexInput = null;



		if (source.indexed) {
			let data = "";





			if (source.indexData) {
				data = source.indexData.reduce((str, item) => {
					str += `<option value="${item[0] || ""}" ${index == (item[0] || "") ? "selected" : ""
						}>${item[1] || ""}</option>`;
					return str;
				}, "");
			}
			console.log(data, source.indexData);
			indexInput = {
				control: "field",
				label: source.indexLabel || "index",
				input: "select",
				ds: {
					fieldType: "index",
				},
				attr: {
					type: "select",
					name: `index`,
					id: `index`,

				},
				prop: {
					innerHTML: data,
					value: index,
				},
				events: {
					change: (e) => {

						this.load({
							unitId: source.unitId,
							command: source.command,
							mode: mode,
							index: e.target.value,
							buttons: source.buttons

						});



					},
				},
			};


			console.log(index);

			const validIndex = source.indexData.find(data => data[0] == index);

			if (!validIndex) {
				form.dataSource = {
					caption: source.label,
					elements: [indexInput]
				};
				return;
			}

		}

		const descriptInput = {
			control: "field",
			label: "Name",
			input: "input",
			ds: {
				fieldType: "descript",
			},
			attr: {
				type: "text",
				name: `name`,
				id: `name`,
				value: source.name || "",
			},
		};

		if (mode === undefined) {
			if (source.mode === "w" || source.mode === "a") {
				mode = "w";
			} else {
				mode = source.mode;
			}
		}

		console.log(mode);
		console.log(source.fields);
		if (!source.fields) {
			source.fields = [];
		}

		const fields = source.fields
			.filter((field) => field.mode === mode)
			.map((field, i: number) => {

				
				let input = "input";
				let type = "text";
				let data = field.data;
				let defPropertys = null;
				let value = values[i] || "";

				switch (field.type) {
					case "index":
						value = index;
						break;
					case "select":
						input = "wh-select";
						
						break;
					case "bit":
						input = "wh-check";
						
						defPropertys = [
							{
								name: "value",
								descriptor: {
									get: function () {

										return [...this.querySelectorAll(`wh-check-option[checked]`)].reduce((sum, option) => {
											sum += Number(option.value);
											return sum;
										}, 0);

									},
									set: function (newValue) {
										console.log(newValue);
										[...this.querySelectorAll(`wh-check-option`)].forEach(input => {
											if (
												(parseInt(value, 10) & parseInt(input.value, 10)) ==
												parseInt(input.value)
											) {
												input.checked = true;
											} else {
												input.checked = false;
											}
										})


									},
								}
							}
						]
						break;
				}
				return {
					control: "field",
					label: field.name || field.label,
					input: input,
					ds: {
						fieldType: "command",
					},
					attr: {
						type: type,
						name: `param_${i}`,
						id: `param_${i}`,

					},
					prop: {
						data,
						value: value,
					},
					defPropertys

				};
			});


			

		const buttons = [];

		if (source.onSave && fields.length > 0) {
			buttons.push({
				caption: source.onSave,
				events: {
					click: (event) => {
						const cmd = {
							type: "cmd",
							unitId: Number(source.unitId),
							command: source.command,
							index: Number(index),
							mode: 1,
							status: 1,
							name: this._descriptValue(),
							params: JSON.stringify(this.getValues(form)),
							query: `["2","6","10"] `,
							values: `["3","7","11"] `,
							user: "panda",
						};

						console.log(cmd);
						this.send(JSON.stringify(cmd));
					},
				},
			});
		}

		if (source.onSend) {
			buttons.push({
				caption: source.onSend,
				events: {
					click: (event) => {
						const cmd = {
							type: "cmd",
							unitId: Number(source.unitId),
							command: source.command,
							index: Number(index),
							mode: 1,
							status: 2,
							name: this._descriptValue(),
							params: JSON.stringify(this.getValues(form)),
							query: `["2","6","10"] `,
							values: `["3","7","11"] `,
							user: "panda",
						};

						console.log(cmd);
						this.send(JSON.stringify(cmd));
					},
				},
			});
		}

		if (source.onRequest && mode === "w") {
			buttons.push({
				caption: source.onRequest,
				events: {
					click: (event) => {
						const fields = source.fields.filter((field) => field.mode === "q");

						if (fields.length > 0) {
							console.log(fields);
							this._createForm(source, "q", index);
						}
					},
				},
			});
		}

		if (source.onConfig && mode === "q") {
			buttons.push({
				caption: source.onConfig,
				events: {
					click: (event) => {
						this._createForm(source, "w", index);
					},
				},
			});
		}

		if (source.onLast) {
			buttons.push({
				caption: source.onLast,
				events: {
					click: (event)=>{
						this.load({
							unitId: source.unitId,
							command: source.command,
							mode: mode,
							index: index,
							buttons: source.buttons,
							last: true

						});
					},
				},
			});
		}
		if (indexInput) {
			form.dataSource = {
				caption: source.label,
				elements: [indexInput, descriptInput, ...fields],
				nav: {
					buttons,
				},
			};
		} else {
			form.dataSource = {
				caption: source.label,
				elements: [descriptInput, ...fields],
				nav: {
					buttons,
				},
			};
		}
		
	}

	getValues(form) {
		const inputs = Array.from(
			form.querySelectorAll(
				`[data-field-type="command"][data-type="form-input"]`
			)
		);

		return inputs.map((e: HTMLInputElement) => e.value.toString());
	}
	getStore(): GTUnitStore {
		return document.querySelector(`gt-unit-store`);
	}

	set show(value) {
		if (this._win) {
			this._win.visibility = value ? "visible" : "hidden";
		}
	}

	getSocket(id?: string): GTSocket {
		if (id) {
			return document.querySelector(`gt-socket[id="${id}"]`);
		}
		return document.querySelector(`gt-socket`);
	}

	send(message) {
		const socket = this.getSocket();
		if (socket) {
			if (socket.status !== "connected") {
				alert("sockect disconnected");
				return;
			}
			socket.send(message);
		}
	}

	_descriptValue() {
		const input = this.querySelector(
			`[data-field-type="descript"]`
		) as HTMLInputElement;

		if (input) {
			return input.value;
		}

		return "";
	}

	loadCommand(command) {

		this._createForm(command, command.mode, command.index);


	}

	load(info) {
		this._go([
			{
				"type": "element",
				"element": "gt-rapid-command",
				"name": null,
				"method": "load-command-data",
				"config": {
					unitId: info.unitId,
					command: info.command,
					index: info.index || 0,
					mode: info.mode || 1,
					role: info.role || "",
					buttons: info.buttons || [],
					last: info.last || false
				},
				"replayToken": "processData",

			}
		]);
	}

	_go(request) {


		const req = {
			confirm: "?",
			valid: true,

			data: {},
			requestFunctions: {
				processData: (data) => {


					console.log(data)


					this.loadCommand(data);

				}
			},
			//requestFunction : null,
			requestFunctionn: (data) => {
				console.log(data)

				return;




			},
			request,
		};

		console.log(req)

		console.log(this)
		this.getApp().go(req);

	}
}

customElements.define("gt-proto-form", GTProtoForm);

class GTProto extends HTMLElement {
	_win = null;
	_menu = null;
	_data = null;

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

	public connectedCallback() { }

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
		return getParentElement(this, "wh-app");
	}

	set commnad(info) {
		const form = new WHForm();
	}

	set dataSource(source) {
		this.innerHTML = "";
		this._data = source;
		console.log(source);
		if (source.commands) {
			this._build();
		}
	}

	_build() {
		const tab = new WHTab();
		tab.dataSource = {
			className: "",
			pages: [
				{
					menu: "C",
					panel: "yanny",
					value: "c",
				},
				{
					menu: "I",
					panel: "esteban",
					selected: true,
				},
				{
					menu: "E",
					panel: "esteban",
					selected: true,
				},
				{
					menu: "Even",
					panel: "esteban",
					selected: true,
				},
				{
					menu: "Reportar",
					panel: "esteban",
					selected: true,
				},
				{
					menu: "Exportar",
					panel: "esteban",
					selected: true,
				},
				{
					menu: "Importar",
					panel: "esteban",
					selected: true,
				},
			],
			events: {
				"tab-open": (e) => {
					console.log(e.detail);
					console.log(e.detail.index);
					const body = tab.querySelector(
						`wh-tab-panel[index="${e.detail.index}"]`
					);
					switch (e.detail.index) {
						case "0":
							body.innerHTML = "";
							body.append(this.createPage("c"));
							break;
						case "1":
							body.innerHTML = "";
							body.append(this.createPage("i"));
							break;
						case "2":
							body.innerHTML = "";
							body.append(this.createPage("x"));
							break;
						case "3":
							body.innerHTML = "";
							body.append(this.createPage("e"));
							break;
					}
				},
			},
		};

		this.append(tab);
	}

	createPage(cat: string) {
		const page = document.createElement("div");

		const list = $(page).create("wh-list-text");
		const body = $(page).create("gt-proto-form");

		//body.prop("unitId", this._data.unit.unitId);
		//body.prop("unitName", this._data.unit.unitName);

		console.log(this._data);

		list.get().dataSource = {
			data: this._data.commands
				.filter((c) => c.cat.toLocaleUpperCase() == cat.toLocaleUpperCase())
				.map((c) => {
					return { value: c.command, text: c.label || c.command };
				}),
		};

		list.on("change", (event) => {

			let buttons = ["onSave", "onSend", "onConfig", "onLast", "onRequest"];
			if (cat === "i") {
				buttons = ["onSend", "onConfig", "onLast"];
			}

			if (cat === "x") {
				buttons = ["onSave", "onSend", "onLast"];
			}

			body.get().load({
				unitId: this._data.unitId,
				command: event.target.value,
				index: 0,
				mode: 1,
				role: null,
				buttons

			});

			return;

			const command = this._data.commands.find(
				(c) => c.command == event.target.value
			);
			//command.mode = "w";

			command.unitId = this._data.unitId;
			//command.unitName = this._data..unitName;
			command.user = this._data.user;

			if (command.onSave === undefined) {
				command.onSave = this._data.actions.onSave;
			}

			if (command.onSend === undefined) {
				command.onSend = this._data.actions.onSend;
			}

			if (command.onRequest === undefined) {
				command.onRequest = this._data.actions.onRequest;
			}

			if (command.onConfig === undefined) {
				command.onConfig = this._data.actions.onConfig;
			}

			if (command.onLast === undefined) {
				command.onLast = this._data.actions.onLast;
			}

			console.log(command);

			body.prop("dataSource", command);
			//body.html(event.target.value);
		});

		return page;
	}

	getStore(): GTUnitStore {
		return document.querySelector(`gt-unit-store`);
	}

	set show(value) {
		if (this._win) {
			this._win.visibility = value ? "visible" : "hidden";
		}
	}
}

customElements.define("gt-proto", GTProto);

class GTProtoWin extends HTMLElement {
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

	public connectedCallback() { }

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
		return getParentElement(this, "wh-app");
	}

	set commnad(info) {
		const form = new WHForm();
	}

	set dataSource(source) {
		console.log(source);

		Promise.all([
			customElements.whenDefined("wh-win"),
			customElements.whenDefined("gt-proto"),
		]).then((_) => this._build(source));
	}

	_build(source) {
		this.caption = source.caption;
		const win = $.create("wh-win");
		const header = win.create("wh-win-header");
		win.attr({
			resizable: "true",
			width: "350px",
			height: "200px",
			movible: "true",
		});

		header.create("wh-win-caption").html(this.caption);

		win.get().style.position = "fixed";
		win.get().style.top = "150px";
		win.get().style.left = "1em";
		const body = win.create("wh-win-body");

		const proto = body.create("gt-proto").get() as GTProto;

		proto.dataSource = source.protocol;

		$(this).append(win);
		this._win = win.get();
	}

	getStore(): GTUnitStore {
		return document.querySelector(`gt-unit-store`);
	}

	set show(value) {
		if (this._win) {
			this._win.visibility = value ? "visible" : "hidden";
		}
	}
}

customElements.define("gt-proto-win", GTProtoWin);
