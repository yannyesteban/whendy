import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
import "../WHTab.js";
import "../ListText.js";
import { WHForm } from "../WHForm.js";
class GTRapidCommand extends HTMLElement {
    constructor() {
        super();
        this._win = null;
        this._menu = null;
        this._body = null;
    }
    static get observedAttributes() {
        return [""];
    }
    connectedCallback() {
        Promise.all([
            customElements.whenDefined("wh-win"),
            customElements.whenDefined("gt-proto"),
        ]).then((_) => this._build());
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
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
    getApp() {
        return getParentElement(this, "wh-app");
    }
    set commnad(info) {
        const form = new WHForm();
    }
    set dataSource(source) {
        console.log(source);
        if (this._win) {
            return;
        }
        Promise.all([
            customElements.whenDefined("wh-win"),
            customElements.whenDefined("gt-proto"),
        ]).then((_) => this._build());
    }
    _build() {
        if (this._win) {
            return;
        }
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
        win.get().style.top = "middle";
        win.get().style.left = "center";
        this._body = win.create("wh-win-body");
        //const proto = body.create("gt-proto").get() as GTProto;
        //proto.dataSource = source.protocol;
        $(this).append(win);
        this._win = win.get();
    }
    getStore() {
        return document.querySelector(`gt-unit-store`);
    }
    set show(value) {
        if (this._win) {
            this._win.visibility = value ? "visible" : "hidden";
        }
    }
    loadCommand(command) {
        this._body.html("");
        const form = $(this._body).create("gt-proto-form");
        const caption = this.querySelector(`wh-win wh-win-caption`);
        caption.innerHTML = command.label + ": " + command.unitName;
        form.prop("dataSource", command);
    }
    _go(request) {
        const req = {
            confirm: "?",
            valid: true,
            data: {},
            requestFunctions: {
                processData: (data) => {
                    this.loadCommand(data);
                    console.log(data);
                }
            },
            //requestFunction : null,
            requestFunctionn: (data) => {
                console.log(data);
                return;
            },
            request,
        };
        console.log(req);
        console.log(this);
        this.getApp().go(req);
    }
    load(info) {
        this._go([
            {
                "type": "element",
                "element": "gt-rapid-command",
                "name": null,
                "method": "load-command-data",
                "config": {
                    unitId: info.unitId || 0,
                    command: info.command || "",
                    index: info.index || 0,
                    mode: info.mode || 1,
                    role: info.role || "",
                    buttons: info.buttons || []
                },
                "replayToken": "processData",
            }
        ]);
    }
}
customElements.define("gt-rapid-command", GTRapidCommand);
//# sourceMappingURL=GTRapidCommand.js.map