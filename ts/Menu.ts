export class Menu extends HTMLElement {
    public server = "";
    
    constructor() {
        super();

    }

    static get observedAttributes() {
        return ['server'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }
    connectedCallback() {
        console.log('Custom square element added to page.');
        this.innerHTML = "hola";
    }
}

customElements.define('wh-menu', Menu);

export class MenuTest extends HTMLElement {
    public server = "";
    constructor() {
        super();

    }

    static get observedAttributes() {
        return ['server'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }
    connectedCallback() {
        console.log('Custom square element added to page.');
        this.innerHTML = "hola";
       
        this.getApp()?.test();
    }

    getApp(){

        let parentNode =  null;
        let ele = this;

        do{
            
            
            parentNode = ele.parentNode;
            ele = parentNode;
            //console.log(parentNode, parentNode.tagName)
        }while(parentNode !== null && parentNode.tagName !== "wh-app".toUpperCase());
        return parentNode;
    }
    
}

customElements.define('wh-menu-test', MenuTest);