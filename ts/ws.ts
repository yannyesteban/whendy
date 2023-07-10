const template = document.createElement('template');
template.innerHTML = `

<style>
    
:host {
    border-radius: 8px;
    border: 3px solid #ff584f;
    padding: 8px 16px;
}
:host(.blue) {
    border: 3px solid #3d6fb4;
}
:host-context(main) {
    border: 3px solid #e3e3e3;
    border-radius: 8px;
    padding: 8px 16px;
}
div {
    display: flex;
    justify-content: center;
    flex-direction: row-reverse;
}
img {
    width: 60px;
    height: 60px;
    margin: 10px;
}
p, ::slotted(p) {
    text-align: center;
    font-size: 32px;
    margin: 0;
    padding: 0;
}
/*  This slot will be disabled because it´s only used as a template for the rating stars 
    and have no functionality */
slot[name="rating-star"] {
   display: none; 
}
/*class styles*/
.rating-item {
    filter: grayscale(100%);
    cursor: pointer;
}
.rating-item.selected {
    filter: none;
}
.rating-item:hover, .rating-item:hover ~ .rating-item {
    filter: none;
}
.rating-star {
    display: block;
    -webkit-mask-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 166 166"><polygon fill="rgb(165,255,214)" points="83 26.8 65.7 61.8 27.1 67.4 55 94.7 48.5 133.2 83 115 117.5 133.2 111 94.7 138.9 67.4 100.3 61.8 83 26.8 83 26.8"/></svg>');
    background-color: #3d6fb4;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center center;
    width: 80px;
    height: 80px;
}
    </style>

    <slot>
      <p part="title">Rating Web Component</p>
</slot>
<div>
    <slot name="rating-star">
        <div part="icon" class="rating-star"></div>
    </slot>
</div>

`;

export class WS extends HTMLElement {
    public server = "";
    public length = 100;
    public innerHTML = "";
    public innerHtml = "";
    public element = null;
    public slotNode = null;
    #config = {};
    constructor() {
        super();
        // attach to the Shadow DOM
        const root = this.attachShadow({mode: 'closed'});
        root.appendChild(template.content.cloneNode(true));
        this.element = root.querySelector('div');
        const slot = this.element.querySelector('slot');
        this.slotNode = slot.querySelector('div');
        slot.addEventListener('slotchange', event => {
            // Take first element of the slot and assign it as new rating star template
            const node = slot.assignedNodes()[0];
            if (node) {
                this.slotNode = node;
                this.render();
            }
        });

        


    }

    get ratingName() {
        return this.getAttribute('rating-name');
    }

    set ratingName(value) {
        this.setAttribute('rating-name', value);
    }

    get maxRating() {
        return +this.getAttribute('max-rating');
    }
    
    set maxRating(value) {
        this.setAttribute('max-rating', value);
    }
    
    get rating() {
        return +this.getAttribute('rating');
    }
    
    set rating(value) {
        if (value < 0) {
            throw new Error('The rating must be higher than zero.');
        }
        const currentRating = +value;
        if (currentRating > this.maxRating) {
            throw new Error('The rating must be lower than the maximum.');
        }
        this.setAttribute('rating', value);
    }
    
    
    connectedCallback () {
        // set default value for maximal rating value
        if (!this.maxRating) {
            this.maxRating = 5;
        } else if(this.maxRating < 0) {
            throw new Error('The rating must be higher than zero.');
        }
        // set default value for rating
        if (!this.rating) {
            this.rating = 0;
        } else if (this.rating < 0 || this.rating > this.maxRating) {
            throw new Error('The rating must be higher than zero and lower than the maximum.');
        }
        this.dispatchEvent(new CustomEvent('ratingChanged', { detail: this.rating }));
        this.render();
        console.log(this.innerHTML)
    }
    
    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal) {
            return;
        }
        
        switch (name) {
            case 'rating':
                this.rating = newVal;
                this.updateRating();
                break;
            case 'max-rating':
                this.maxRating = newVal;
                this.render();
                break;
        }
    }
    
    render() {
        this.clearRatingElements();
        for (let i = this.maxRating; i > 0; i--) {
            i = parseInt(i);
            const selected = this.rating ? this.rating >= i : false;
            this.createRatingStar(selected, i);
        }
    }
    
    clearRatingElements() {
        const nodes = this.element.getElementsByClassName('rating-item');
        if (nodes) {
            while (nodes.length > 0) {
                nodes[0].parentNode.removeChild(nodes[0]);
            }
        }
    }
    
    createRatingStar(selected, itemId) {
      const ratingTemplate = document.createElement('div');
        ratingTemplate.setAttribute('class', selected ? `rating-item item-${itemId} selected` : `rating-item item-${itemId}`);
        ratingTemplate.appendChild(this.slotNode.cloneNode(true));
        ratingTemplate.addEventListener('click', value => {
            this.changeRating(itemId);
        });
        this.element.appendChild(ratingTemplate);
    }
    
    changeRating(event) {
        this.rating = event;
        this.updateRating();
        this.dispatchEvent(new CustomEvent('ratingChanged', { detail: this.rating }));
    }
    
    updateRating() {
        for (let currentRating = 1; currentRating <= this.maxRating; currentRating++) {
            let ratingItem = this.element.getElementsByClassName(`item-${currentRating}`)[0];
            if (ratingItem) {
                if (currentRating <= this.rating) {
                    if (ratingItem.className.indexOf('selected') < 0) {
                        ratingItem.className = ratingItem.className + ' selected';
                    }
                } else {
                    ratingItem.className = ratingItem.className.replace('selected', '');
                }
            }
        }
    }
}

customElements.define('wh-ws', WS);

window["WS"] = WS;


let selected_ = null;
  
// See https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel
  
customElements.define('fancy-tabs', class extends HTMLElement {

  constructor() {
    super(); // always call super() first in the ctor.

    // Create shadow DOM for the component.
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: 650px;
          font-family: 'Roboto Slab';
          contain: content;
        }
        :host([background]) {
          background: var(--background-color, #9E9E9E);
          border-radius: 10px;
          padding: 10px;
        }
        #panels {
          box-shadow: 0 2px 2px rgba(0, 0, 0, .3);
          background: white;
          border-radius: 3px;
          padding: 16px;
          height: 250px;
          overflow: auto;
        }
        #tabs {
          display: inline-flex;
          -webkit-user-select: none;
          user-select: none;
        }
        #tabs slot {
          display: inline-flex; /* Safari bug. Treats <slot> as a parent */
        }
        /* Safari does not support #id prefixes on ::slotted
           See https://bugs.webkit.org/show_bug.cgi?id=160538 */
        #tabs ::slotted(*) {
          font: 400 16px/22px 'Roboto';
          padding: 16px 8px;
          margin: 0;
          text-align: center;
          width: 100px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          cursor: pointer;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          background: linear-gradient(#fafafa, #eee);
          border: none; /* if the user users a <button> */
        }
        #tabs ::slotted([aria-selected="true"]) {
          font-weight: 600;
          background: white;
          box-shadow: none;
        }
        #tabs ::slotted(:focus) {
          z-index: 1; /* make sure focus ring doesn't get buried */
        }
        #panels ::slotted([aria-hidden="true"]) {
          display: none;
        }
      </style>
      <div id="tabs">
        <slot id="tabsSlot" name="title"></slot>
      </div>
      <div id="panels">
        <slot id="panelsSlot"></slot>
      </div>
    `;
  }
  
  get selected() {
    return selected_;
  }

  set selected(idx) {
    selected_ = idx;
    this._selectTab(idx);

    // Updated the element's selected attribute value when
    // backing property changes.
    this.setAttribute('selected', idx);
  }
  
  connectedCallback() {
    this.setAttribute('role', 'tablist');

    const tabsSlot = this.shadowRoot.querySelector('#tabsSlot') as HTMLSlotElement;
    const panelsSlot = this.shadowRoot.querySelector('#panelsSlot') as HTMLSlotElement;

    this.tabs = tabsSlot.assignedNodes({flatten: true});
    this.panels = panelsSlot.assignedNodes({flatten: true}).filter(el => {
      return el.nodeType === Node.ELEMENT_NODE;
    });
    
    // Add aria role="tabpanel" to each content panel.
    for (let [i, panel] of this.panels.entries()) {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('tabindex', 0);
    }
    
    // Save refer to we can remove listeners later.
    this._boundOnTitleClick = this._onTitleClick.bind(this);
    this._boundOnKeyDown = this._onKeyDown.bind(this);

    tabsSlot.addEventListener('click', this._boundOnTitleClick);
    tabsSlot.addEventListener('keydown', this._boundOnKeyDown);
    
    this.selected = this._findFirstSelectedTab() || 0;
  }
  
  disconnectedCallback() {
    const tabsSlot = this.shadowRoot.querySelector('#tabsSlot');
    tabsSlot.removeEventListener('click', this._boundOnTitleClick);
    tabsSlot.removeEventListener('keydown', this._boundOnKeyDown);
  }
  
  _onTitleClick(e) { 
    if (e.target.slot === 'title') {
      this.selected = this.tabs.indexOf(e.target);
      e.target.focus();
    }
  }
  
  _onKeyDown(e) {
    switch (e.code) {
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        var idx = this.selected - 1;
        idx = idx < 0 ? this.tabs.length - 1 : idx;
        this.tabs[idx].click();
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        var idx = this.selected + 1;
        this.tabs[idx % this.tabs.length].click();
        break;
      default:
        break;
    }
  }

  _findFirstSelectedTab() {
    let selectedIdx;
    for (let [i, tab] of this.tabs.entries()) {
      tab.setAttribute('role', 'tab');

      // Allow users to declaratively select a tab
      // Highlight last tab which has the selected attribute.
      if (tab.hasAttribute('selected')) {
        selectedIdx = i;
      }
    }
    return selectedIdx;
  }
  
  _selectTab(idx = null) {
    for (let i = 0, tab; tab = this.tabs[i]; ++i) {
      let select = i === idx;
      tab.setAttribute('tabindex', select ? 0 : -1);
      tab.setAttribute('aria-selected', select);
      this.panels[i].setAttribute('aria-hidden', !select);
    }
  }
  
});