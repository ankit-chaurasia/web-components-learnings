class Tooltip extends HTMLElement {
  constructor() {
    super();
    this._toolTipContainer;
    this._tooltipText = "Some dummy tool tip text";
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
        <style>
            div {
                background-color: black;
                color: white;
                position: absolute;
                z-index: 10;
            }
        </style>
        <slot>Some default value</slot>
        <span> (?)</span>
    `;
  }

  connectedCallback() {
    if (this.hasAttribute("text")) {
      this._tooltipText = this.getAttribute("text");
    }
    const toolTipIcon = this.shadowRoot.querySelector("span");
    toolTipIcon.addEventListener("mouseenter", this._showTooltip);
    toolTipIcon.addEventListener("mouseleave", this._hideTooltip);
    this.shadowRoot.appendChild(toolTipIcon);
    this.style.position = "relative";
  }

  _showTooltip = () => {
    this._toolTipContainer = document.createElement("div");
    this._toolTipContainer.textContent = this._tooltipText;
    this.shadowRoot.appendChild(this._toolTipContainer);
  };

  _hideTooltip = () => {
    this.shadowRoot.removeChild(this._toolTipContainer);
  };
}

customElements.define("uc-tooltip", Tooltip);
