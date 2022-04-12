import { Q as $ } from "./Q.js";


export class WHInfo extends HTMLElement {

    _template = "";
	constructor() {
		super();

		const template = document.createElement("template");

		template.innerHTML = `
			<style>
			:host {
				display:block;
				
				
			}

			
			</style><slot name=""></slot>

			`;

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(template.content.cloneNode(true));

		const slot = this.shadowRoot.querySelector("slot");

		slot.addEventListener("slotchange", (e) => {
			//const nodes = slot.assignedNodes();
		});

	}

	static get observedAttributes() {
		return ["mode"];
	}

	public connectedCallback() {

        


	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
		console.log("attributeChangedCallback");

	}

	set name(value) {
		this.setAttribute("name", value);
	}

	get name() {
		return this.getAttribute("name");
	}

	set visible(value) {

		if (Boolean(value)) {
			this.setAttribute("visible", "");
		} else {
			this.removeAttribute("visible");
		}
	}



	get visible() {
		return this.hasAttribute("visible");
	}


    set mode(value) {

		if (Boolean(value)) {
			this.setAttribute("mode", value);
		} else {
			this.removeAttribute("mode");
		}
	}



	get mode() {
		return this.getAttribute("mode");
	}


    set template(value) {

		if (Boolean(value)) {
			this.setAttribute("template", value);
		} else {
			this.removeAttribute("template");
		}
	}



	get template() {
		return this.getAttribute("template");
	}

	set data(data){
        if(!this.template){
            return:
        }
        console.log(this.template);
        const template = document.createElement("template");
        template.innerHTML = this.template;

        console.log(template, template.content.firstElementChild)
        let html = template.content.firstElementChild;
		this.setTemplate(html, data);
		this.innerHTML = "";
		this.appendChild(html);

        return

/*
		let html = this.cloneNode(true);
		this.setTemplate(html, data);
		this.shadowRoot.innerHTML = "";
		this.shadowRoot.appendChild(html);*/
	}


	setTemplate(template, data, master?) {

        console.log(template)
        /* eval all variables */

        /*
        const myExp: string = template.dataset.exp;

        if (myExp !== undefined) {
            this.evalExp(myExp, data);
        }

        template.removeAttribute("data-exp");
        */
        this.evalAttributes(template, data, master);

        template.innerHTML = this.evalHTML(template.innerHTML, data, master);

        let child;

        while (child = template.querySelector("[data-detail]")) {

            const myKey:string = child.dataset.detailKey || null;
            const myIndex: string = child.dataset.detailIndex || null;
            const myExp:string = child.dataset.detailExp;

            let aKey = child.dataset.detail.split(":");

            let key = aKey[0];
            let alias = aKey[1] || key;

            child.removeAttribute("data-detail");
            child.removeAttribute("data-detail-key");
            child.removeAttribute("data-detail-index");
            child.removeAttribute("data-detail-exp");

            let mainTemplate = document.importNode(child, true);
            let lastNode = child;

            if (data[key]) {
                
                let auxKey = alias;

                if (master) {
                    auxKey = master + "." + key;
                }
                let i = 0;
                for (let x in data[key]) {
                    const detailData = Object.assign({}, data[key][x]);
                    if (myKey) {
                        detailData[myKey] = x;
                    }
                    if (myIndex) {
                        detailData[myIndex] = i;
                    }

                    let clone = document.importNode(mainTemplate, true);

                    if (myExp !== undefined) {
                        this.evalExp(myExp, detailData);
                    }

                    this.setTemplate(clone, detailData, auxKey);
                    child.parentNode.insertBefore(clone, lastNode.nextSibling);
                    lastNode = clone;
                    i++;
                }
            }
            child.remove();
        }
    }

    evalAttributes(element:HTMLElement, data, key?) {

        for (let i = element.attributes.length - 1; i >= 0; i--) {
            element.setAttribute(element.attributes[i].name, this.evalHTML(element.attributes[i].value, data, key));
        }
    }

    evalHTML(string, data, key?) {

        let regex;

        if (key) {
            regex = new RegExp("\\{=" + key + "\.([a-z0-9-_\.]+)\}", "gi");
        } else {
            regex = /\{=([a-z0-9-_\.]+)\}/gi;
        }

        string = string.replace(regex, (str, index, p2, offset, s) => {

            let levels = index.split(".");
            let tempData = data;
            let valid = true;
            
            levels.forEach(key => {
                
                if(valid && tempData[key] !== undefined && tempData[key] === null){
                    tempData = "";
                    valid = false;
                }else if (valid && tempData[key] !== undefined) {
                    tempData = tempData[key];
                    valid = true;
                } else {
                    valid = false;
                }

            });

            if (valid) {
                
                return tempData;
            }
            return str;
        });


        return string;

    }

    evalExp(exp, data, key?) {
        let regex = new RegExp("({([a-z0-9-_\.]+)=([^}]+)\})", "gi");
        let info = exp.matchAll(regex);
        for (let match of info) {
            try {
                const F =  $.bind("return "+match[3], data);
                data[match[2]] = F();
            } catch (error) {
                console.log(error);
            }
        }
    }

}

customElements.define("wh-info", WHInfo);