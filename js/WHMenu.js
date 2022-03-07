import { Q as $ } from "./Q.js";
import "./WH.js";
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
        return ["action", "checkbox", "check"];
    }
    connectedCallback() {
        this.slot = "link";
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
            case 'action':
                if (newValue) {
                    this._defineAction(newValue);
                }
                break;
            case 'check':
                if (newValue) {
                    this._defineCheck(newValue);
                }
                break;
        }
    }
    set action(value) {
        if (typeof value === "string") {
            this.setAttribute("action", value);
            this._action = null;
        }
        else {
            this.setAttribute("action", "");
            this._action = value;
            if (value) {
                this._defineAction(value);
            }
        }
    }
    get action() {
        if (this._action !== null) {
            return this._action;
        }
        return this.getAttribute("action");
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
    set checkbox(value) {
        if (Boolean(value)) {
            this.setAttribute("checkbox", "");
        }
        else {
            this.removeAttribute("checkbox");
        }
        if (this.checkbox) {
        }
    }
    get checkbox() {
        return this.hasAttribute('checkbox');
    }
    _defineAction(fn) {
        const action = $.bind(fn, this, "item, dataUser, event");
        $(this).on("click", (event) => {
            console.log(event.target);
            if (event.target.getAttribute('type') !== "checkbox") {
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
        const links = Array.from(this.querySelectorAll('wh-link'));
        links.forEach(link => {
            link["checkbox"] = true;
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
    ;
}
customElements.define("wh-menu", WHMenu);
//# sourceMappingURL=WHMenu.js.map