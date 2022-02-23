import { loadScript } from "./LoadScript.js";
import { loadCss } from "./LoadCss.js";
import { _sgQuery as $ } from "./Query.js";
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
        data.forEach((item) => {
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
        return;
        const request = {
            confirm: "?",
            valid: true,
            data: {},
            //requestFunction : null,
            requestFunctionss: {
                getEven: (json) => { },
            },
            request: [
                {
                    type: "init",
                    element: "GTMap",
                    id: "test",
                    config: {
                        "name": "one",
                        "method": "load",
                    },
                    setPanel: "wh-body",
                    setTemplate: null,
                    replayToken: "xxx",
                },
            ],
        };
        this.go(request);
    }
    go(info) {
        var _a;
        let body;
        if (info.dataForm) {
        }
        else {
        }
        fetch(this.server, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                __sg_request: info.request,
                __sg_data: (_a = info.data) !== null && _a !== void 0 ? _a : null,
            }),
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
            console.log(json);
            this.decodeResponse(json, info.requestFunctions || null);
        });
    }
    initApp() {
        const request = {
            confirm: "?",
            valid: true,
            data: {
                name: "yanny nuñez",
            },
            requestFunction: (data) => {
                data.cssSheets.forEach((sheet) => {
                    loadCss(sheet, true);
                });
                this.innerHTML = data.template;
                this.modules = data.modules;
                console.log("yanny");
                console.log(this.modules);
                document.getElementById("wh-menu").addEventListener("click", (event) => {
                    this.test();
                });
            },
            request: [
                {
                    type: "init-app",
                    element: "",
                    id: null,
                    config: {},
                    setPanel: null,
                    setTemplate: null,
                },
            ],
        };
        this.go(request);
    }
    initElement(element) {
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
        console.log(element);
        console.log(this.modules);
        if (!this.components[element.iClass]) {
            const m = this.modules.find((e) => e.name == element.iClass);
            if (m) {
                console.log(m);
                loadScript(m.src, { async: true, type: "module" }).then((e) => {
                    console.log(window[element.iClass]);
                    this._e[id] = $.create(element.component).get();
                    for (let x in element.config) {
                        console.log(x, element.config[x]);
                        //this._e[id].setAttribute(x, element.config[x]);
                        this._e[id][x] = element.config[x];
                    }
                    ;
                    if (element.setPanel) {
                        const panel = $(element.setPanel);
                        if (panel) {
                            panel.text("");
                            panel.append(this._e[id]);
                        }
                    }
                });
                /*import(m.src).then(MyModule => {
                            
                            console.log(MyModule.Map)
                            this._e[id] = new MyModule[m.name](element.config);
                            this._e[id].test();
                            $(id).text("");
                            $(id).append(this._e[id]);
                         })
                         */
            }
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