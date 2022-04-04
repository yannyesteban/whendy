import { Q as $ } from "../Q.js";
import { getParentElement, fire } from "../Tool.js";

const IDENTITY = Symbol('proxy_target_identity')

const _handler = (element) => {
	return {
		gett(target, key, receiver) {

			//console.log({ target, key });
			if (key === IDENTITY) {
				return target
			  }

			if (key == 'isProxy'){
				return true;
			}
			const prop = target[key];
			
			if (typeof prop == 'undefined' || prop === null){
				return;
			}
				
			if (!prop.isProxy && typeof prop === 'object'){
				target[key] = new Proxy(prop, _handler(element));
			}
			return Reflect.get(target, key, receiver)
			//return target[key];
		},
		set(target, key, value) {
			let oldValue = target[key];
			//console.log({ target, key, value , oldValue, type: typeof value})
			if (oldValue !== value) {
				fire(element, `${String(key)}-data-changed`, value);

				console.log(`${String(key)}-data-changed`, value);
			}
			
			target[key] = value;
			
			fire(element, `${String(key)}-data-set`, value);

			console.log(`${String(key)}-data-set`, value);
			return true;
		}
	}
}

export class GTUnitStore extends HTMLElement {
	_request = [];
	_actions = [];
	_timer = null;
	_delay = 1000;
	dataStore = {};
	_dataStore = null;

	constructor() {
		super();



	}

	static get observedAttributes() {
		return [""];
	}

	public connectedCallback() {

		//this._handler = this._handler.bind(this);
		this._dataStore = this.watch(this.dataStore);
	}

	
	watch(some) {
		return new Proxy(some, _handler(this));
	}

	public disconnectedCallback() {
		console.log("disconnectedCallback");
	}

	public attributeChangedCallback(name, oldVal, newVal) {
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

	get store(){
		return this._dataStore;
	}

	updateItem(name, value){


		if(typeof this._dataStore[name] === 'object'){
			this._dataStore[name] = Object.assign(this._dataStore[name], value);
		}else{
			this._dataStore[name] = value;
		}
		
	}


	getItem(name){

		if(typeof this._dataStore[name] === 'object'){
			return Object.assign({}, this._dataStore[name]);
		}else{
			return this._dataStore[name];
		}
		
	}

	getIdentity(name){
		return this._dataStore[name][IDENTITY];
	}

	public getApp() {
		return getParentElement(this, "wh-app");
	}

	set registerRequest(request) {
		
		this._request.push(request);
	}

	_play() {
		this._stop();

		this._timer = setInterval(() => {
			console.log("play");

			this._go(this._request.map(r => r.request));
		}, this._delay * 1000);
	}

	_stop() {
		if (this._timer) {
			window.clearTimeout(this._timer);
		}
	}
	_go(request) {

		const req = {
			confirm: "?",
			valid: true,

			data: {},
			//requestFunction : null,
			requestFunction: (json) => {
				console.log(json)

				json.forEach(data => {
					if (data.storeData) {
						this._dataStore[data.storeData.name] = data.storeData.data;
					}
				})


				

			},
			request,
		};

		console.log(req)
		this.getApp().go(req);

	}

	test() {
		alert("test")
	}

	getUnitData(unitId) {
		alert(8)
		console.log(unitId);
		const request = {
			confirm: "?",
			valid: true,

			data: {},
			requestFunction: (json) => {
				console.log(json)

				json.forEach(data => {
					if (data.storeData) {
						this._dataStore[data.storeData.name] = data.storeData.data;
					}
				})


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

	registerAction(name, fn) {
		this._actions[name] = fn;
		console.log("action ", name)
	}

	run(name, ...params) {
		console.log(name)
		if (this._actions[name]) {
			console.log(this._actions[name](...params))
			this._go(this._actions[name](...params));
		}
		
	}

}

customElements.define("gt-unit-store", GTUnitStore);