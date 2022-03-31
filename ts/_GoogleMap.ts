export class Map extends HTMLElement {
    public server = "";
    public length = 100;
    public innerHTML = "";
    public innerHtml = "";
    public _obj = {};
    #config = {};
    constructor() {
        super();


    }

    set obj(value){

        this._obj = value;
        console.log(this._obj)
    }

    get obj(){
        return this._obj;
    }

    set man(value) {
        const isChecked = Boolean(value);
        if (isChecked)
          this.setAttribute('man', 'x');
        else
          this.removeAttribute('man');
      }
      
      get man() {
        return this.hasAttribute('man');
      }
      

    static get observedAttributes() {
        return ['server', 'length', 'innerHtml'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }
    connectedCallback() {
        console.log(this.innerHtml);
        //this.innerHTML = this.innerHtml+this.length;
        //this.innerHTML = `hola es un Map con ${this.length}...!!!`;
    }

    test() {
       console.log("test from Map.ts") ;
    }
}

customElements.define('wh-map', Map);

window["WHMap"] = Map;