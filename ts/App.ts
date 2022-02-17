import { _sgQuery as $, _sgQuery as X } from "./Query.js";

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
        } catch (error) {
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
            myScript.setAttribute("type", "module");
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
        } catch (error) {
            reject({
                status: false,
                msg: error,
            });
        }
    });
};

export interface IResponse {
    id: string;
    type: string;
    data: any;
    reply?: string;
    [key: string]: any;
}

interface IElement {
    id: string;
    iClass: string;
    title: string;
    html: string;
    script: string;
    css: string;
    config: any;
    data: any;
    setPanel: string;
}

export class App extends HTMLElement {
    public server = "";
    public modules = [];
    public components = [];

    public _e = [];

    constructor() {
        super();
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

    decodeResponse(data: IResponse[], requestFunctions?: (config) => void[]) {
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
                    element: "map",
                    id: "test",
                    config: {
                        "name": "one",
                        "method":"load",
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
        let body;
        if (info.dataForm) {
        } else {
        }

        fetch(this.server, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                __sg_request: info.request,
                __sg_data: info.data ?? null,
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
                    loadCssFile(sheet, true);
                });
                this.innerHTML = data.template;
                this.modules = data.modules;
                console.log("yanny");
                console.log(this.modules);
                document.getElementById("wh-menu").addEventListener("click", (event)=>{
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

    initElement(element: IElement | IResponse) {
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

                loadScriptFile(m.src, true).then((e) => {
                    console.log(window[element.iClass]);


                    this._e[id] = $.create("wh-map").get();


                    for(let x in element.config){
                        console.log(x)

                        this._e[id].setAttribute(x, element.config[x]);

                    };
                    if(element.setPanel ){
                        const panel = $(element.setPanel);
                        if(panel){
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
