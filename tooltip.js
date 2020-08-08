class Tooltip extends HTMLElement {
  constructor() {
    super();
    this._toolTipIcon;
    this._toolTipVisible = false;
    this._tooltipText = "Some dummy tool tip text";
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <style>
            div {
              font-weight: normal; 
                background-color: black;
                color: white;
                position: absolute;
                top: 1.5rem;
                left: 0.75rem;
                z-index: 10;
                padding: 0.15rem;
                border-radius: 3px;
                box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.26);
            }
            .hightlight {
              background-color: red;
            }
            ::slotted(.hightlight) { 
              border : 1px dotted  green;
            }
            :host {
              background: #707070;
              position: relative;
            }
            :host(.important) {
              background: var(--color-primary, #ccc);
              padding: 0.15rem;
            }
            .icon {
              background: black;
              color: white;
              padding: 0.15rem 0.5rem;
              text-align: center;
              border-radius: 50%;
            }
            :host-context(p){
              font-weight: bold; 
            }
        </style>
        <slot>Some default value</slot>
        <span class="icon">?</span>
    `;
  }

  connectedCallback() {
    if (this.hasAttribute("text")) {
      this._tooltipText = this.getAttribute("text");
    }
    this._toolTipIcon = this.shadowRoot.querySelector("span");
    this._toolTipIcon.addEventListener("mouseenter", this._showTooltip);
    this._toolTipIcon.addEventListener("mouseleave", this._hideTooltip);
  }

  disconnectedCallback() {
    this._toolTipIcon.removeEventListener("mouseenter", this._showTooltip);
    this._toolTipIcon.removeEventListener("mouseleave", this._hideTooltip);
  }

  static get observedAttributes() {
    return ["text"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    if (name === "text") {
      this._tooltipText = newValue;
    }
  }

  _render = () => {
    let toolTipContainer = this.shadowRoot.querySelector("div");
    if (this._toolTipVisible) {
      toolTipContainer = document.createElement("div");
      toolTipContainer.textContent = this._tooltipText;
      this.shadowRoot.appendChild(toolTipContainer);
    } else {
      if (toolTipContainer) {
        this.shadowRoot.removeChild(toolTipContainer);
      }
    }
  };

  _showTooltip = () => {
    this._toolTipVisible = true;
    this._render();
  };

  _hideTooltip = () => {
    this._toolTipVisible = false;
    this._render();
  };
}

customElements.define("uc-tooltip", Tooltip);
