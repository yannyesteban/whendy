import { loadScript } from "./LoadScript.js";
import { loadCss } from "./LoadCss.js";
import { Q as $ } from "./Q.js";
export class App extends HTMLElement {
    constructor() {
        super();
        this.server = "";
        this.modules = [];
        this.components = [];
        this._e = [];
        this.token = "x.y.z";
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
            switch (item.mode) {
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
                    this.updateElement(item);
                    break;
                case "response":
                    break;
                case "init":
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
    initApp() {
        const request = {
            confirm: "?",
            valid: true,
            headers: {
                "Application-Mode": "start"
            },
            data: {
                id: this.id,
            },
            requestFunctionS: (data) => {
                data.cssSheets.forEach((sheet) => {
                    loadCss(sheet, true);
                });
                this.innerHTML = data.template;
                this.modules = data.modules;
                console.log(this.modules);
            },
            request: [],
            request2: [
                {
                    type: "init-app",
                    element: "app",
                    method: "init",
                    id: null,
                    config: {},
                    setPanel: null,
                    setTemplate: null,
                },
            ],
        };
        this.go(request);
    }
    whenComponent(module) {
        console.log(module.src);
        return new Promise((resolve, reject) => {
            if (customElements.get(module.component)) {
                console.log("opcion 1");
                resolve(customElements.get(module.component));
            }
            import(module.src).then(MyModule => {
                console.log("opcion 2");
                resolve(customElements.get(module.component));
            }).catch(error => {
                reject(error);
            });
        });
    }
    updateElement(info) {
        const e = $.id(info.id);
        if (e) {
            if (info.props) {
                e.prop(info.props);
            }
        }
    }
    importModule(element) {
        const m = this.modules.find((e) => e.name == element.iClass);
        const module = this.modules.find((e) => e.component == element.wc);
        loadScript(m.src, { async: true, type: "module" }).then((info) => {
            const e = $.create(element.wc);
            e.id(element.id);
            e.prop(element.props);
            e.attr(element.attrs);
            const panel = $.id(element.setPanel);
            if (panel) {
                panel.text("");
                panel.append(e);
            }
        });
    }
    initElement(element) {
        const module = this.modules.find((e) => e.component == element.wc);
        if (module) {
            this.whenComponent(module).then((component) => {
                const e = $.create(module.component);
                e.id(element.id);
                e.prop(element.props);
                e.attr(element.attrs);
                const panel = $.id(element.setPanel);
                if (panel) {
                    panel.text("");
                    panel.append(e);
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }
    go(info) {
        var _a;
        console.log(info);
        let body;
        if (info.dataForm) {
        }
        else {
        }
        const headers = Object.assign({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`
        }, info.headers || {});
        fetch(this.server, {
            method: "post",
            headers,
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
            console.log(json);
            if (info.requestFunction) {
                info.requestFunction(json);
                return true;
            }
            this.decodeResponse(json, info.requestFunctions || null);
        });
    }
}
customElements.define("wh-app", App);
//# sourceMappingURL=App.js.map