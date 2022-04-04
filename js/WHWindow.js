import { _sgQuery as $ } from "./Query.js";
import { getParentElement, fire } from "./Tool.js";
import { Float, Move, Resize } from "./Float.js";
class WHWinIcon extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.slot = "icon";
    }
}
customElements.define("wh-win-icon", WHWinIcon);
class WHWinCaption extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.slot = "caption";
    }
}
customElements.define("wh-win-caption", WHWinCaption);
class WHWinBody extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.slot = "body";
    }
}
customElements.define("wh-win-body", WHWinBody);
class WHWinHeader extends HTMLElement {
    constructor() {
        super();
        this.win = null;
        this.mode = "";
        const template = document.createElement("template");
        template.innerHTML = `
			
			<link rel="stylesheet" href="./../css/WHHeader.css">
			
				<div class="icon"><slot name="icon"></slot></div>
				<div class="caption"><slot name="caption"></slot></div>
				<div class="option"><slot name="option"></slot></div>
				<div class="control">
					<button class="min"></button>
					<button class="auto"></button>
					<button class="max"></button>
					<button class="exit"></button>
				</div>
			
			
			
			<slot></slot>

		`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        /*this.shadowRoot.addEventListener("slotchange", (event) => {
            [...event.target.assignedElements()].forEach(e => {

            })

        });*/
    }
    static get observedAttributes() {
        return ["mode", "paz"];
    }
    connectedCallback() {
        this.slot = "header";
        $(this.shadowRoot).q(".min").on("click", event => {
            this.getWin().setAttribute("mode", "min");
        });
        $(this.shadowRoot).q(".max").on("click", event => {
            this.getWin().setAttribute("mode", "max");
        });
        $(this.shadowRoot).q(".auto").on("click", event => {
            this.getWin().setAttribute("mode", "");
            //this.getWin().updatePos();
            this.getWin().updateSize();
        });
        $(this.shadowRoot).q(".exit").on("click", event => {
            this.getWin().setAttribute("visibility", "hidden");
        });
        $(this).on("dblclick", event => {
            if (this.getWin().mode === "max") {
                this.getWin().setAttribute("mode", "");
            }
            else {
                this.getWin().setAttribute("mode", "max");
            }
        });
        this.getWin().addEventListener("mode-changed", (e) => {
            this.setAttribute("mode", e.detail.mode);
        });
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        this[name] = newVal;
    }
    getWin() {
        return getParentElement(this, "wh-win");
    }
}
customElements.define("wh-win-header", WHWinHeader);
class WHWin extends HTMLElement {
    constructor() {
        super();
        this.mode = "";
        this.visibility = "";
        this.resizable = "";
        this.movible = "";
        this.left = "";
        this.top = "";
        this.width = "";
        this.height = "";
        const template = document.createElement("template");
        template.innerHTML = `

			<link rel="stylesheet" href="./../css/WHWindow.css">
			
			<slot name="header"></slot>
			<slot name="body"></slot>
			<slot></slot>
			`;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        /*
        this.shadowRoot.addEventListener("slotchange", (event) => {
                    [...event.target.assignedElements()].forEach(e => {
                        console.log(e.nodeName)
                        if (e.nodeName.toLowerCase() == "wh-win-header") {
                            e.slot = "header"
                        }

                        if (e.nodeName.toLowerCase() == "wh-win-body") {
                            e.slot = "body"
                        }
                    })

                });
        */
    }
    static get observedAttributes() {
        return ["visibility", "mode", "resizable", "movible", "left", "top", "width", "height"];
    }
    connectedCallback() {
        const holder = this.querySelector(`wh-win-header`);
        Float.init(this);
        Move.init({ main: this, hand: holder, onDrag: (info) => {
                if (this.mode === "max") {
                    const w = this.offsetWidth;
                    this.setAttribute("mode", "custom");
                    const w2 = this.offsetWidth;
                    this.style.left = (info.x - (w2 * (info.x - info.left) / w)) + "px";
                    return true;
                }
            } });
        Resize.init({
            main: this,
            onStart: (info) => {
                this.style.left = info.left + "px";
                this.style.width = info.width + "px";
                this.style.top = info.top + "px";
                this.style.height = info.height + "px";
                this.setAttribute("mode", "custom");
            },
            onRelease: (info) => {
                this.width = info.width + "px";
                this.height = info.height + "px";
            }
        });
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
        this[name] = newVal;
        switch (name) {
            case "mode":
                fire(this, "mode-changed", { mode: newVal });
                break;
            case "left":
            case "top":
                this.updatePos();
                break;
            case "width":
            case "height":
                this.updateSize();
                break;
        }
    }
    test() {
        alert("soy tu padre");
    }
    updatePos() {
        this.style.left = this.left;
        this.style.top = this.top;
    }
    updateSize() {
        this.style.width = this.width;
        this.style.height = this.height;
    }
}
customElements.define("wh-win", WHWin);
//# sourceMappingURL=WHWindow.js.map