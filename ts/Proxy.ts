import { loadScript } from "./LoadScript.js";
import { getParentElement, fire } from "./Tool.js";


const handler = {
    get(target, key) {

        console.log({target, key});


        if (key == 'isProxy')
            return true;
        const prop = target[key];
        if (typeof prop == 'undefined')
            return;
        if (!prop.isProxy && typeof prop === 'object')
            target[key] = new Proxy(prop, handler);
        return target[key];
    },
    set(target, key, value) {
        console.log('Setting', target, `.${key} to equal`, value);
        target[key] = value;
        return true;
    }
    };
    
     var test1 = {
        string: "data",
        number: 231321,
        object: {
            string: "data",
            number: 32434,
            nested: {
                prop1: 1,
                prop2: 2
            }
        },
        array: [
            1, 2, 3, 4, 5
        ],
    };
    
    export var test = new Proxy (test1, handler);
    
    
    test.number=123
    
    test.object.string = "keke"
    
    test.object.nested.prop3 = {
        s:"12474737"
    }


  
export class P{


    _dataStore = null;
    dataStore = null;
    obj = null;
    constructor(){


        this.obj = document.createElement("div");
        this.dataStore = {}

        this._dataStore = this.watch(this.dataStore)


    }

    setData(key, value){
        this._dataStore[key] = value;
    }

    public connectedCallback() {

		this._dataStore = this.watch(this.dataStore);
	}

    getStore(){
        return this._dataStore;
    }
    getData(name){

        return this._dataStore[name];


        
    }
	watch(some){
		return new Proxy(some, {
			set: (obj, prop, value)=> {
				let oldValue = obj[prop];

				if(oldValue !== value){
					fire(this.obj, `${String(prop)}-data-changed`, value);

					console.log(`${String(prop)}-data-changed`)
				}
				console.log({obj, prop, value})
				obj[prop] = value;
				fire(this.obj, `${String(prop)}-data-set`, value);
				return true;
			},

            get(obj, prop){
                return obj[prop];
            }
		});
	}

    test(){
        alert("te")
    }
}
