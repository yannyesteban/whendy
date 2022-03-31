import { getParentElement, fire } from "../Tool.js";
class GTUnitStore extends HTMLElement {
    constructor() {
        super();
        this._request = [];
        this._timer = null;
        this._delay = 5;
        this.dataStore = {};
        this._dataStore = null;
    }
    static get observedAttributes() {
        return [""];
    }
    connectedCallback() {
        this._dataStore = new Proxy(this.dataStore, {
            set: (obj, prop, value) => {
                let oldValue = obj[prop];
                if (oldValue !== value) {
                    fire(this, `${String(prop)}-data-changed`, value);
                    console.log(`${String(prop)}-data-changed`);
                }
                console.log({ obj, prop, value });
                obj[prop] = value;
                fire(this, `${String(prop)}-data-set`, value);
                return true;
            }
        });
    }
    disconnectedCallback() {
        console.log("disconnectedCallback");
    }
    attributeChangedCallback(name, oldVal, newVal) {
        console.log("attributeChangedCallback");
    }
    set dataSource(source) {
        console.log(source);
        /*
                this.registerRequest({
                    name: "uno",
                    request: {
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
                    }
                });
        
                this.registerRequest({
                    name: "dos",
                    request: {
                        type: "init",
                        element: "GT",
                        id: "test",
                        config: {
                            "name": "dos",
                            "method": "load",
                        }
        
        
        
                    }
                });
                
                this._go();
                */
        window.setTimeout(() => {
            this._play();
        }, 5000);
    }
    getApp() {
        return getParentElement(this, "wh-app");
    }
    set registerRequest(request) {
        console.log(request);
        this._request.push(request);
    }
    _play() {
        this._stop();
        this._timer = setInterval(() => {
            console.log("play");
            this._go();
        }, this._delay * 1000);
    }
    _stop() {
        if (this._timer) {
            window.clearTimeout(this._timer);
        }
    }
    _go() {
        console.log(this._request);
        const request = {
            confirm: "?",
            valid: true,
            data: {},
            //requestFunction : null,
            requestFunction: (json) => {
                console.log(json);
                json.forEach(data => {
                    if (data.storeData) {
                        this._dataStore[data.storeData.name] = data.storeData.data;
                    }
                });
            },
            request: this._request.map(r => r.request),
        };
        console.log(request);
        this.getApp().go(request);
    }
    test() {
        alert("test");
    }
    getUnitData(unitId) {
        console.log(unitId);
        const request = {
            confirm: "?",
            valid: true,
            data: {},
            requestFunction: (json) => {
                console.log(json);
                json.forEach(data => {
                    if (data.storeData) {
                        this._dataStore[data.storeData.name] = data.storeData.data;
                    }
                });
            },
            requestFunctionss: {
                getEven: (json) => { },
            },
            request: [
                {
                    "type": "element",
                    "setPanell": "wh-banner",
                    "element": "gt-unit",
                    "name": null,
                    "method": "load-unit-data",
                    "config": {
                        unitId
                    }
                }
            ],
        };
        this.getApp().go(request);
    }
}
customElements.define("gt-unit-store", GTUnitStore);
//# sourceMappingURL=GTUnitStore%20copy.js.map