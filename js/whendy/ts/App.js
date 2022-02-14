const loadCssFile = (url, async) => {
    return new Promise((resolve, reject) => {
        try {
            const myScript = document.createElement("link");
            myScript.setAttribute("href", url);
            myScript.setAttribute("rel", "stylesheet");
            myScript.setAttribute("type", "text/css");
            //myScript.setAttribute("async", async);
            myScript.addEventListener("load", (event) => {
                resolve({
                    status: true,
                });
            });
            myScript.addEventListener("error", (event) => {
                reject({
                    status: false,
                    msg: "error",
                });
            });
            document.body.appendChild(myScript);
        }
        catch (error) {
            reject({
                status: false,
                msg: error,
            });
        }
    });
};
const loadScriptFile = (url, async) => {
    return new Promise((resolve, reject) => {
        try {
            const myScript = document.createElement("script");
            myScript.setAttribute("src", url);
            myScript.setAttribute("async", async);
            myScript.addEventListener("load", (event) => {
                resolve({
                    status: true,
                });
            });
            myScript.addEventListener("error", (event) => {
                reject({
                    status: false,
                    msg: "error",
                });
            });
            document.body.appendChild(myScript);
        }
        catch (error) {
            reject({
                status: false,
                msg: error,
            });
        }
    });
};
import { _sgQuery as $ } from "../../Sevian2020/Sevian/ts/Query.js";
alert(2);
export class App extends HTMLElement {
    constructor() {
        super();
        this.server = "";
        this.modules = [];
        this.components = [];
        this._e = [];
    }
    static get observedAttributes() {
        return ["server"];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }
    connectedCallback() {
        console.log("Custom square element added to page.");
        this.innerHTML = "hola";
        this.initApp();
    }
    decodeResponse(data, requestFunctions) {
        console.log(data);
        data.forEach(item => {
            if (item.iToken && requestFunctions && requestFunctions[item.iToken]) {
                requestFunctions[item.iToken](item.data);
                return;
            }
            switch (item.type) {
                case "debug":
                    console.log(item.info);
                    break;
                case "dataForm":
                    for (let key in item.dataForm) {
                        //this.setVar(key, item.dataForm[key]);
                    }
                    break;
                case "panel":
                    break;
                case "update":
                    //this.updateElement(item)
                    break;
                case "response":
                    break;
                case "element":
                    this.initElement(item);
                    break;
                case "fragment":
                    break;
                case "message": //push, delay,
                    /*
                    this.msg = new Float.Message(item);
                        this.msg.show({});
                        
                        */
                    break;
                case "notice": //push, delay,
                    break;
            }
        });
    }
    test() {
        const request = {
            confirm: "?",
            valid: true,
            data: {},
            requestFunction: null,
            requestFunctions: {
                getEven: (json) => { }
            },
            request: [
                {
                    id: "wh-body",
                    element: "map",
                    method: "load",
                    name: "",
                    eparams: {
                        "a": "b"
                    },
                    replayToken: "xxx"
                }
            ]
        };
        this.go(request);
    }
    go(info) {
        fetch(this.server, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(info.request),
        })
            .then((response) => {
            return response.json();
        })
            .catch((error) => { })
            .then((json) => {
            if (info.requestFunction) {
                info.requestFunction(json);
                return true;
            }
            this.decodeResponse(json, info.requestFunctions || null);
        });
    }
    initApp() {
        const request = {
            confirm: "?",
            valid: true,
            data: {},
            requestFunction: data => {
                data.cssSheets.forEach((sheet) => {
                    loadCssFile(sheet, true);
                });
                this.innerHTML = data.template;
                this.modules = data.modules;
                console.log("yanny");
                console.log(this.modules);
            },
            request: {
                init: true
            }
        };
        this.go(request);
    }
    initElement(element) {
        alert(33);
        return;
        if (!element) {
            return;
        }
        const id = element.id;
        if ($(id)) {
            $(id).text(element.html);
        }
        if (element.script) {
            $.appendScript(element.script);
        }
        if (element.css) {
            $.appendStyle(element.css);
        }
        if (element.title) {
            document.title = element.title;
        }
        if (this.components[element.iClass] && element.config !== null) {
            if (this._e[id]) {
                delete this._e[id];
            }
            this._e[id] = new this.components[element.iClass](element.config); //x.option
        }
    }
}
customElements.define("wh-app", App);
//# sourceMappingURL=App.js.map