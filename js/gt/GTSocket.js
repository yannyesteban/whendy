import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
import "../WHTab.js";
class GTSocket extends HTMLElement {
    constructor() {
        super();
        this._win = null;
        this._menu = null;
        this._socket = null;
        const template = document.createElement("template");
        template.innerHTML = `
			<style>
			:host {
				display:block;
				border:0px solid red;
				height:10px;
				width:10px;
				
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
    static get observedAttributes() {
        return ["status", "url", "port"];
    }
    connectedCallback() {
        this._connect = $.bind(this._connect, this);
        //this._onOpen = $.bind(this._onOpen, this);
        //this._onClose = $.bind(this._onClose, this);
        //this._onMessage = $.bind(this._onMessage, this);
        //this._onError = $.bind(this._onError, this);
        this._connect();
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        switch (name) {
            case "port":
                if (this._socket) {
                    this._socket.close();
                }
                this._connect();
                break;
        }
    }
    set url(value) {
        if (Boolean(value)) {
            this.setAttribute("url", value);
        }
        else {
            this.removeAttribute("url");
        }
    }
    get url() {
        return this.getAttribute("url");
    }
    set port(value) {
        if (Boolean(value)) {
            this.setAttribute("port", value);
        }
        else {
            this.removeAttribute("port");
        }
    }
    get port() {
        return this.getAttribute("port");
    }
    set user(value) {
        if (Boolean(value)) {
            this.setAttribute("user", value);
        }
        else {
            this.removeAttribute("user");
        }
    }
    get user() {
        return this.getAttribute("user");
    }
    set name(value) {
        if (Boolean(value)) {
            this.setAttribute("name", value);
        }
        else {
            this.removeAttribute("name");
        }
    }
    get name() {
        return this.getAttribute("name");
    }
    set status(value) {
        if (Boolean(value)) {
            this.setAttribute("status", value);
        }
        else {
            this.removeAttribute("status");
        }
    }
    get status() {
        return this.getAttribute("status");
    }
    set caption(value) {
        if (Boolean(value)) {
            this.setAttribute("caption", value);
        }
        else {
            this.removeAttribute("caption");
        }
    }
    get caption() {
        return this.getAttribute("caption");
    }
    getApp() {
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
    getStore() {
        return document.querySelector(`gt-unit-store`);
    }
    set show(value) {
        if (this._win) {
            this._win.visibility = (value) ? "visible" : "hidden";
        }
    }
    _connect() {
        const url = this.url || "localhost";
        const port = this.port || 3341;
        console.log(`ws://${url}:${port}`);
        try {
            this._socket = new WebSocket(`ws://${url}:${port}`);
            if (!this._socket) {
                console.log("error....");
            }
            this._socket.onopen = this._onOpen.bind(this);
            this._socket.onmessage = this._onMessage.bind(this);
            this._socket.onclose = this._onClose.bind(this);
            this._socket.onerror = this._onError.bind(this);
        }
        catch (e) {
            console.log(e);
        }
    }
    _onOpen(event) {
        this.status = "connected";
    }
    _onMessage(event) {
        console.log(event.data);
    }
    _onError(event) {
        console.log("Error closing Websocket");
        if (this._socket) {
            this._socket.close();
        }
        this._socket = null;
    }
    _onClose(event) {
        this.status = "disconnected";
        // Try to reconnect in 5 seconds
        console.log("Try to reconnect in 5 seconds");
        setTimeout(() => {
            //db ("Connection lost...!!!");
            console.log(this);
            this._connect();
        }, 1000);
    }
    _close() {
    }
    send(message) {
        console.log(message);
        if (this._socket) {
            console.log(message);
            this._socket.send(message);
        }
    }
}
customElements.define("gt-socket", GTSocket);
//# sourceMappingURL=GTSocket.js.map