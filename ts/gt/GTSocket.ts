import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
import "../WHTab.js";
import { GTUnitStore } from "./GTUnitStore.js";

class GTSocket extends HTMLElement {

	_win = null;
	_menu = null;

	_socket:WebSocket = null;
	static get observedAttributes() {
		return ["status", "url", "port"];
	}


	constructor() {
		super();

		
		const template = document.createElement("template");

		template.innerHTML = `
			<style>
			:host {
				display:block;
				border:2px solid red;
				
			}

			:host([status="connected"]) {
				display:block;
				background-color:green;
				
			}
			:host(:not([status="connected"])) {
				display:block;
				background-color:red;
				
			}

			
			</style><slot></slot>

			`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));
		return;	
		const slot = this.shadowRoot.querySelector("slot");

		slot.addEventListener("slotchange", (e) => {
			//const nodes = slot.assignedNodes();
		});

	}



	public connectedCallback() {

		this._connect = $.bind(this._connect, this);
		
		this._onOpen = $.bind(this._onOpen, this);
		this._onClose = $.bind(this._onClose, this);
		this._onMessage = $.bind(this._onMessage, this);
		this._onError = $.bind(this._onError, this);

		this._connect();



	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");
		switch(name){
			case "port":
				if(this._socket){
					this._socket.close();
				}
				this._connect();
				break;
		}

	}

	set url(value) {
		if (Boolean(value)) {
			this.setAttribute("url", value);
		} else {
			this.removeAttribute("url");
		}
	}

	get url() {
		return this.getAttribute("url");
	}


	set port(value) {
		if (Boolean(value)) {
			this.setAttribute("port", value);
		} else {
			this.removeAttribute("port");
		}
	}

	get port() {
		return this.getAttribute("port");
	}

	set status(value) {
		if (Boolean(value)) {
			this.setAttribute("status", value);
		} else {
			this.removeAttribute("status");
		}
	}

	get status() {
		return this.getAttribute("status");
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
			const body = win.create("wh-win-body");

			$(this).append(win);
			this._win = win.get();
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

	_connect(){
		const url = this.url || "localhost";
		const port = this.port || 3341;
		console.log(`ws://${url}:${port}`);
		try{
			this._socket = new WebSocket(`ws://${url}:${port}`);

			if(!this._socket){
				console.log("error....")
			}

			this._socket.onopen = this._onOpen;
			this._socket.onmessage = this._onMessage;
			this._socket.onclose = this._onClose;
			this._socket.onerror = this._onError;
		}catch(e){
			console.log(e)
		}
		
	}

	_onOpen(event){
		this.status = "connected";
	}

	_onMessage(event){
		console.log(event.data);
	}

	_onError(event){
		console.log("Error closing Websocket");
		if(this._socket){
			this._socket.close();
		}
		
	}

	_onClose(event){
		this.status = "disconnected";
		// Try to reconnect in 5 seconds
		console.log("Try to reconnect in 5 seconds");
		setTimeout(() => {
			//db ("Connection lost...!!!");
			this._connect();
		}, 5000);
	}

	_close(){
		
		
		
	}

	send(message){
		console.log(message)
		if(this._socket){
			
			console.log(message)


			this._socket.send(message);
		}
	}

}

customElements.define("gt-socket", GTSocket);