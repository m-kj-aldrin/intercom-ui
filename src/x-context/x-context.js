import { clickOutside } from "../x-input/src/custom-elements/x-select.js";

const xContextTemplate = document.createElement("template");
xContextTemplate.innerHTML = `
<style>
    :host{
        position: fixed;
        background-color: #fff;
        left: var(--x, 50%);
        top: var(--y, 50%);
        z-index: 100;
        display:flex;
        gap: 4px;
    }
</style>
<slot></slot>
`;

export class XContextElement extends HTMLElement {
    #clickOutsideController = new AbortController();

    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.shadowRoot.append(xContextTemplate.content.cloneNode(true));

        this.#attachListeners();
    }

    #attachListeners() {
        this.addEventListener("click-outside", (e) => {
            this.remove();
        });
    }

    connectedCallback() {
        this.#clickOutsideController = new AbortController();
        window.addEventListener("pointerdown", clickOutside.bind(this), {
            signal: this.#clickOutsideController.signal,
        });
    }
    disconnectedCallback() {
        this.#clickOutsideController.abort();
    }
}

customElements.define("x-context", XContextElement);
