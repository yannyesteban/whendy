import { Q as $ } from "../Q.js";
import { getParentElement } from "../Tool.js";
import "../WHTab.js";
import { WHTab } from "../WHTab.js";
import "../ListText.js";
import { WHForm } from "../WHForm.js";
class GTProtoForm extends HTMLElement {
    constructor() {
        super();
        this._win = null;
        this._menu = null;
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
    connectedCallback() { }
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
    set unitId(value) {
        if (Boolean(value)) {
            this.setAttribute("unit-id", value);
        }
        else {
            this.removeAttribute("unit-id");
        }
    }
    get unitId() {
        return this.getAttribute("unit-id");
    }
    set unitName(value) {
        if (Boolean(value)) {
            this.setAttribute("unit-name", value);
        }
        else {
            this.removeAttribute("unit-name");
        }
    }
    get unitName() {
        return this.getAttribute("unit-name");
    }
    getApp() {
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
        const form = $(this).create("wh-form").get();
        const values = ["yan", "este", "nun", "jim", "alb", "x1", "x2"];
        let indexInput = null;
        if (source.indexed) {
            let data = "";
            if (source.indexData) {
                data = source.indexData.reduce((str, item) => {
                    str += `<option value="${item[0] || ""}" ${index == (item[0] || "") ? "selected" : ""}>${item[1] || ""}</option>`;
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
                    value: index,
                },
                prop: {
                    innerHTML: data,
                },
                events: {
                    change: (e) => {
                        this._createForm(source, mode, e.target.value);
                    },
                },
            };
            console.log(index);
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
            },
        };
        if (mode === undefined) {
            if (source.mode === "w" || source.mode === "a") {
                mode = "w";
            }
            else {
                mode = source.mode;
            }
        }
        console.log(mode);
        console.log(source.fields);
        if (!source.fields) {
            return;
        }
        const fields = source.fields
            .filter((field) => field.mode === mode)
            .map((field, i) => {
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
                                    this.value = newValue;
                                },
                            }
                        }
                    ];
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
                    name: `param_${index}`,
                    id: `param_${index}`,
                    value: value,
                },
                prop: {
                    data
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
                    click: "console.log('onLast')",
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
        }
        else {
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
        const inputs = Array.from(form.querySelectorAll(`[data-field-type="command"][data-type="form-input"]`));
        return inputs.map((e) => e.value.toString());
    }
    getStore() {
        return document.querySelector(`gt-unit-store`);
    }
    set show(value) {
        if (this._win) {
            this._win.visibility = value ? "visible" : "hidden";
        }
    }
    getSocket(id) {
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
        const input = this.querySelector(`[data-field-type="descript"]`);
        if (input) {
            return input.value;
        }
        return "";
    }
}
customElements.define("gt-proto-form", GTProtoForm);
class GTProto extends HTMLElement {
    constructor() {
        super();
        this._win = null;
        this._menu = null;
        this._data = null;
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
    connectedCallback() { }
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
        this.innerHTML = "";
        this._data = source;
        console.log(source);
        if (source.commands) {
            this._buid();
        }
    }
    _buid() {
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
                    const body = tab.querySelector(`wh-tab-panel[index="${e.detail.index}"]`);
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
    createPage(cat) {
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
            const command = this._data.commands.find((c) => c.command == event.target.value);
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
    getStore() {
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
    constructor() {
        super();
        this._win = null;
        this._menu = null;
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
    connectedCallback() { }
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
        const proto = body.create("gt-proto").get();
        proto.dataSource = source.protocol;
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
}
customElements.define("gt-proto-win", GTProtoWin);
//# sourceMappingURL=GTProtoForm.js.map