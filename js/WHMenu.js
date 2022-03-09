import { Q as $ } from "./Q.js";
import "./WH.js";
function dispatchEvent(element, eventName, detail) {
    const event = new CustomEvent(eventName, {
        detail
    });
    element.dispatchEvent(event);
}
class WHMenuLink extends HTMLElement {
    constructor() {
        super();
        this.pepe = "";
        this._action = null;
        this._check = null;
        this._checkbox = null;
        const template = document.createElement("template");
        template.innerHTML = `
			<link rel="stylesheet" href="./../css/WHMenuItem.css">
			<input type="checkbox">
			
			<slot name="icon"></slot>	
			<slot name="caption"></slot>
			<div class="ind"></div>
			<slot></slot>	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    static get observedAttributes() {
        return ["onaction", "usecheck", "oncheck", "value", "disabled", "checked"];
    }
    connectedCallback() {
        this.slot = "link";
        const checkbox = $(this.shadowRoot).query(`input[type="checkbox"]`);
        checkbox.on("click", (event) => {
            dispatchEvent(checkbox.get(), "link-check", this);
        });
        $(this).on("click", () => {
            dispatchEvent(this, "link-action", this);
        });
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'link');
        }
        this._upgradeProperty('action');
    }
    _upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'value':
                break;
            case 'checked':
                break;
            case 'disabled':
                break;
            case 'visible':
                break;
            case 'use-check':
                break;
            case 'use-icon':
                break;
            case 'onaction':
                break;
            case 'oncheck':
                break;
        }
    }
    set value(value) {
        this.setAttribute("value", value);
    }
    get value() {
        return this.getAttribute('value');
    }
    get check() {
        if (this._check !== null) {
            return this._check;
        }
        return this.getAttribute("check");
    }
    set check(value) {
        if (typeof value === "string") {
            this.setAttribute("check", value);
            this._check = null;
        }
        else {
            this.setAttribute("check", "");
            this._check = value;
            if (value) {
                this._defineCheck(value);
            }
        }
    }
    set useIcon(value) {
        if (Boolean(value)) {
            this.setAttribute("use-icon", "");
        }
        else {
            this.removeAttribute("use-icon");
        }
    }
    get useIcon() {
        return this.hasAttribute('use-icon');
    }
    set useCheck(value) {
        if (Boolean(value)) {
            this.setAttribute("use-check", "");
        }
        else {
            this.removeAttribute("use-check");
        }
    }
    get useCheck() {
        return this.hasAttribute('use-check');
    }
    set checked(value) {
        if (Boolean(value)) {
            this.setAttribute("checked", "");
        }
        else {
            this.removeAttribute("checked");
        }
    }
    get checked() {
        return this.hasAttribute('checked');
    }
    set disabled(value) {
        if (Boolean(value)) {
            this.setAttribute("disabled", "");
        }
        else {
            this.removeAttribute("disabled");
        }
    }
    get disabled() {
        return this.hasAttribute('disabled');
    }
    set visible(value) {
        if (Boolean(value)) {
            this.setAttribute("visible", "");
        }
        else {
            this.removeAttribute("visible");
        }
    }
    get visible() {
        return this.hasAttribute('visible');
    }
    _defineAction(fn) {
        const action = $.bind(fn, this, "item, dataUser, event");
        $(this).on("click", (event) => {
            const myCheckbox = event.composedPath()[0];
            if (myCheckbox.getAttribute('type') !== "checkbox") {
                action(this, "datauser", event);
            }
        });
    }
    _defineCheck(fn) {
        console.log("DOS");
        const action = $.bind(fn, this, "item, dataUser, event");
        console.log($(this.shadowRoot).query(`input[type]`));
        //console.log($(this).query(`input`))
        $(this.shadowRoot).query(`input[type]`).on("click", (event) => {
            action(this, "datauser", event);
        });
    }
    navigateLink(e) {
        if (e.type === 'click' || e.key === 'Enter') {
            let ref = e.target != null ? e.target : e.srcElement;
            if (ref) {
                window.open(ref.getAttribute('data-href'), '_blank');
            }
        }
    }
}
customElements.define("wh-link", WHMenuLink);
class WHMenuCaption extends HTMLElement {
    constructor() {
        super();
        //this.slot = "caption";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<link rel="stylesheet" href="./../css/WHHeader1.css">
		<slot></slot>	
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.slot = "caption";
    }
}
customElements.define("wh-caption2", WHMenuCaption);
class WHMenugroup extends HTMLElement {
    constructor() {
        super();
        //this.slot = "group";
        const template = document.createElement("template");
        template.innerHTML = `
			
		<link rel="stylesheet" href="./../css/WHMenuItem.css">
		<slot name="item"></slot>	
	
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() {
        this.slot = "group";
    }
}
customElements.define("wh-group", WHMenugroup);
class WHMenuItem extends HTMLElement {
    static get observedAttributes() {
        return [];
    }
    constructor() {
        super();
        //this.slot = "header";
        const template = document.createElement("template");
        template.innerHTML = `
			
			<link rel="stylesheet" href="./../css/WHMenuItem.css">
			
			<slot name="link"></slot>	
			<slot></slot>
			<slot name="group"></slot>
			
			
		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        /*this.shadowRoot.addEventListener("slotchange", (event) => {
            [...event.target.assignedElements()].forEach(e => {

            })

        });*/
    }
    connectedCallback() {
        this.slot = "item";
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        this[name] = newVal;
    }
}
customElements.define("wh-menu-item", WHMenuItem);
class WHMenu extends HTMLElement {
    static get observedAttributes() {
        return ["checkbox", "mode"];
    }
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
		<link rel="stylesheet" href="./../css/WHMenu.css">
		
		<slot name="item"></slot>

`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const slot = this.shadowRoot.querySelector("slot");
        slot.addEventListener("slotchange", (e) => {
            //const nodes = slot.assignedNodes();
        });
    }
    initMenu() {
        $(this).on("click", (e) => {
            console.log(e.target);
        });
        $(this).on("link-action", (e) => {
            console.log(e);
        });
        const links = Array.from(this.querySelectorAll('wh-link'));
        links.forEach(link => {
            link["checkbox"] = true;
            link.addEventListener("link-action", () => {
                dispatchEvent(this, "link-action", link);
            });
        });
        const groups = this.querySelectorAll(`wh-menu-item > wh-group`);
        groups.forEach((group) => {
            $(group.parentElement).addClass(["sub-menu", "close"]);
            const link = $(group.parentElement).query("wh-link");
            if (link) {
                link.addClass(["sub-menu", "close"]);
                link.on("click", (event) => {
                    if (event.target.getAttribute('type') !== "checkbox") {
                        link.toggleClass("close");
                        $(group.parentElement).toggleClass("close");
                    }
                });
            }
        });
    }
    connectedCallback() {
        this.initMenu();
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        console.log({ name, oldVal, newVal });
        //this[name] = newVal;
    }
    loadConfig(dataSource) {
        this.innerHTML = "";
        if (dataSource.items) {
            this.loadItems(this, dataSource.items);
        }
        this.initMenu();
    }
    loadItems(menu, items) {
        let item;
        let link;
        let icon;
        let caption;
        items.forEach((info, index) => {
            item = $(menu).create("wh-menu-item");
            link = item.create("wh-link");
            link.prop("action", info.action || null);
            link.prop("checkbox", this.checkbox || null);
            icon = link.create("wh-icon").html(info.icon || "");
            caption = link.create("wh-caption").html(info.caption || "");
            if (info.items) {
                const group = item.create("wh-group");
                this.loadItems(group, info.items);
            }
        });
    }
    set checkbox(value) {
        console.log("set checkbox", value);
        if (Boolean(value)) {
            this.setAttribute("checkbox", "");
        }
        else {
            this.removeAttribute("checkbox");
        }
    }
    get checkbox() {
        console.log("get check box", this.getAttribute('checkbox'));
        return this.hasAttribute('checkbox');
    }
}
customElements.define("wh-menu", WHMenu);
//# sourceMappingURL=WHMenu.js.map