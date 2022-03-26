import { Q as $ } from "./Q.js";


class WHGridCaption extends HTMLElement {
	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
			
		<link rel="stylesheet" href="./../css/WHGrid.css">
		<slot></slot>
	
		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
	public connectedCallback() {
		this.slot = "caption";
	}
}
customElements.define("wh-grid-caption", WHGridCaption);

class WHGridCell extends HTMLElement {
	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
			
		<link rel="stylesheet" href="./../css/WHGrid.css">
		<slot></slot>
	
		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
	public connectedCallback() {
		this.slot = "cell";
	}

	set value(value) {

		if (Boolean(value)) {
			this.setAttribute("value", value);
		} else {
			this.removeAttribute("value");
		}
	}

	get value() {

		return this.getAttribute('value')
	}


	set field(value) {

		if (Boolean(value)) {
			this.setAttribute("field", value);
		} else {
			this.removeAttribute("field");
		}
	}

	get field() {

		return this.getAttribute('field')
	}


	public render() {
		if (this.hasAttribute("value")) {
			this.innerHTML = this.getAttribute("value");
		}
	}
}
customElements.define("wh-grid-cell", WHGridCell);


class WHGridRow extends HTMLElement {

	static get observedAttributes() {
		return ["select-mode", "selected"];
	}

	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
			
		<link rel="stylesheet" href="./../css/WHGrid.css">
		<div><input type="checkbox"></div><slot name="cell"></slot>
	
		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}
	public connectedCallback() {
		console.log("connectedCallback");
		this.slot = "row";
		
		
		$(this.shadowRoot.querySelector(`input`)).on("click", this._click.bind(this));

		
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");
		
		switch(name){
			case "select-mode":
				this._selectMode(newVal);
				break;
			case "selected":
				this._selectInput();
				break;

				
		}
	}

	set selected(value) {
		console.log("set selected")
		if (Boolean(value)) {
			this.setAttribute("selected", "");
		} else {
			this.removeAttribute("selected");
		}
	}

	get selected() {

		return this.hasAttribute('selected')
	}

	set selectMode(value) {
		console.log("set selectMode")
		if (Boolean(value)) {
			this.setAttribute("select-mode", value);
		} else {
			this.removeAttribute("select-mode");
		}
	}

	get selectMode() {

		return this.getAttribute('select-mode')
	}

	_link(){
		if(this.hasAttribute("select-mode")){
			this.shadowRoot.querySelector(`input`).removeAttribute("hidden");
		}
	}

	_click(event) {
		console.log("_click")
		this.selected = event.target.checked;
	}

	_selectMode(value){
		switch(value){
			case "one":
				$(this.shadowRoot.querySelector(`input`)).attr("type", "radio");
				break;
			case "multi":
				$(this.shadowRoot.querySelector(`input`)).attr("type", "checkbox");
				break;				

		}
	}

	_selectInput(){
		
		this.shadowRoot.querySelector(`input`).checked = this.selected;
	}
}
customElements.define("wh-grid-row", WHGridRow);

class WHGrid extends HTMLElement {

	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
		<link rel="stylesheet" href="./../css/WHGrid.css">
		<slot name="caption"></slot>
		<div class="grid"><slot name="row"></slot></div>
		<slot></slot>

		`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));

		const slot = this.shadowRoot.querySelector("slot");

		slot.addEventListener("slotchange", (e) => {
			//const nodes = slot.assignedNodes();
		});

	}

	static get observedAttributes() {
		return [""];
	}

	public connectedCallback() {

	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");
		this[name] = newVal;
	}


	set selectMode(value) {
		console.log("set selected")
		if (Boolean(value)) {
			this.setAttribute("select-mode", value);
		} else {
			this.removeAttribute("select-mode");
		}
	}

	get selectMode() {

		return this.getAttribute('select-mode')
	}

	set dataSource(source) {
		this.innerHTML = "";

		if(source.selectMode){
			this.selectMode = source.selectMode;
		}
		if (source.caption) {
			this._createCaption(source.caption);
		}

		if (source.fields) {
			this._craeteHeaderRow(source.fields);
		}
		if (source.data) {
			source.data.forEach(info => {
				this._createRow(info);
			})
		}
	}

	_createCaption(caption) {
		$(this).create("wh-grid-caption").html(caption);
	}

	_craeteHeaderRow(info) {
		const row = $(this).create("wh-grid-row").addClass("header");
		row.prop("selectMode", this.selectMode);

		info.forEach(data => {
			row.create("wh-grid-cell").ds("field", data.name).html(data.caption);
		});

	}
	_createRow(info) {
		const row = $(this).create("wh-grid-row").addClass("row");
		row.get().selectMode = this.selectMode;

		
		
		for (let key in info) {
			row.create("wh-grid-cell").attr("field", key).attr("value", info[key]).html(info[key]);
		}
	}

	_getAllRow() {
		return [... this.querySelectorAll(`wh-grid-row.row`)];
	}

	_getRowValues(row) {
		const cells = [...row.querySelectorAll(`wh-grid-cell`)] as WHGridCell[];
		const data = {};
		cells.forEach(cell => {
			data[cell.field] = cell.value;
		});
		return data;
	}
	get value() {
		const rows = this._getAllRow();
		const data = [];
		rows.forEach(row => {
			data.push(this._getRowValues(row));
		})


		return data;
	}

}

customElements.define("wh-grid", WHGrid);