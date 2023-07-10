import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
import "../WHTab.js";
import * as Tool from "../Tool.js";
class GTCommand extends HTMLElement {
    constructor() {
        super();
        this._win = null;
        this._menu = null;
        this._last = null;
        this._proto = null;
        this._started = false;
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
        return [""];
    }
    connectedCallback() {
        this._unitChange = this._unitChange.bind(this);
        this._unitsChange = this._unitsChange.bind(this);
        Promise.all([
            customElements.whenDefined("wh-win"),
            customElements.whenDefined("wh-app"),
            customElements.whenDefined("gt-unit-store"),
            //customElements.whenDefined("gt-proto-win"),
        ]).then((_) => this._start());
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
        if (this._started) {
            Tool.whenApp(this).then((app) => {
                $(app).off("unit-data-set", this._unitChange);
                $(app).off("units-data-changed", this._unitsChange);
            });
        }
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
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
    set test(msg) {
        alert(msg);
    }
    getApp() {
        return getParentElement(this, "wh-app");
    }
    set dataSource(source) {
        console.log(source);
        Promise.all([
            customElements.whenDefined("wh-win"),
            customElements.whenDefined("wh-app"),
            customElements.whenDefined("gt-unit-store"),
            this.whenWindow(),
        ]).then((_) => this._build(source));
    }
    getStore() {
        return document.querySelector(`gt-unit-store`);
    }
    set show(value) {
        if (this._win) {
            this._win.visibility = (value) ? "visible" : "hidden";
        }
    }
    whenWindow() {
        return new Promise((resolve, reject) => {
            console.log(this);
            let win = this.querySelector(`wh-win`);
            if (win) {
                resolve(win);
                return;
            }
            const _win = $.create("wh-win");
            const header = _win.create("wh-win-header");
            _win.attr({
                resizable: "true", width: "350px", "height": "200px",
                movible: "true", //visibility:"hiddenn"
            });
            header.create("wh-win-caption").html(this.caption || "x");
            _win.get().style.position = "fixed";
            _win.get().style.top = "150px";
            _win.get().style.left = "1em";
            const body = _win.create("wh-win-body");
            $(this).append(_win);
            this._win = _win.get();
            resolve(this._win);
        });
    }
    _start() {
        Tool.whenApp(this).then((app) => {
            $(app).on("unit-data-set", this._unitChange);
            $(app).on("units-data-changed", this._unitsChange);
        });
        const store = this.getStore();
        store.registerAction("load-unit-command", (unitId, active) => {
            return [
                {
                    "type": "element",
                    "element": "gt-command",
                    "name": null,
                    "method": "load-unit-data",
                    "config": {
                        unitId,
                        active
                    }
                }
            ];
        });
        //const win = $.create("wh-win");
        //const header = win.create("wh-win-header");
        this._started = true;
    }
    _build(source) {
        const store = this.getStore();
        this._last = store.getItem("unit");
        if (!this._last) {
            alert("unit not selected!!!");
            return;
        }
        console.log(source);
        source.protocol.unit = this._last;
        this.caption = source.caption || "";
        this._loadProto(source.protocol);
        return;
        const proto = document.createElement("gt-proto-win");
        this.append(proto);
        proto.dataSource = {
            caption: source.caption,
            protocol: source.protocol
        };
        return;
        const win = $.create("wh-win");
        const header = win.create("wh-win-header");
        win.attr({
            resizable: "true", width: "350px", "height": "200px",
            movible: "true"
        });
        header.create("wh-win-caption").html(this.caption + this._last.unitName);
        win.get().style.position = "fixed";
        win.get().style.top = "150px";
        win.get().style.left = "1em";
        const body = win.create("wh-win-body");
        $(this).append(win);
        this._win = win.get();
    }
    _getProtoWin(name) {
        let proto = this.querySelector(`gt-proto`);
        if (!proto) {
            proto = document.createElement("gt-proto");
            this._win.querySelector(`wh-win-body`).innerHTML = "";
            this._win.querySelector(`wh-win-body`).append(proto);
        }
        return proto;
    }
    _loadProto(protoSource) {
        const proto = this._getProtoWin();
        if (proto) {
            this.whenWindow().then(win => {
                console.log(protoSource);
                win.querySelector(`wh-win-caption`).innerHTML = this.caption + protoSource.unitName;
            });
            console.log(protoSource);
            proto.dataSource = protoSource;
        }
    }
    _unitChange({ detail }) {
        this._last = detail;
        console.log("detail", detail);
        this.whenWindow().then(win => {
            if (win.visibility !== "hidden") {
                this._go([{
                        "id": this.id,
                        "type": "element",
                        "element": "gt-command",
                        "name": null,
                        "method": "load-unit-data",
                        "config": {
                            unitId: this._last.unitId
                        }
                    }]);
            }
        });
        //this.getStore().run("load-unit-command", this._last.unitId, "5555")
    }
    _unitsChange({ detail }) {
        console.log("detail", detail);
        if (detail.unitId) {
            this._last = detail.unitId;
        }
    }
    updateLast() {
    }
    _setUnit(unit) {
        this._last = unit;
    }
    _go(request) {
        const req = {
            confirm: "?",
            valid: true,
            data: {},
            //requestFunction : null,
            requestFunction: (data) => {
                console.log(data);
                const source = data[0] || {};
                console.log(source);
                //return;
                source.data.unit = this._last;
                this._loadProto(source.data);
                return;
            },
            request,
        };
        console.log(req);
        console.log(this);
        this.getApp().go(req);
    }
}
customElements.define("gt-command", GTCommand);
//# sourceMappingURL=GTCommand.js.map