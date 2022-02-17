export class Map extends HTMLElement {
    public server = "";
    public length = 100;
    #config = {};
    constructor() {
        super();


    }

    static get observedAttributes() {
        return ['server', 'length'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }
    connectedCallback() {
        console.log('Map');
        this.innerHTML = `hola es un Map con ${this.length}...!!!`;
    }

    test() {
       console.log("test from Map.ts") ;
    }
}

customElements.define('wh-map', Map);

window["WHMap"] = Map;