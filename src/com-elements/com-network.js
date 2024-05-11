import { InputBaseElement } from "../x-input/src/custom-elements/base.js";
import { IntercomBaseElement } from "./base.js";

const intercomNetworkTemplate = document.createElement("template");
intercomNetworkTemplate.innerHTML = `
<div id="chains" class="h-list">
    <slot></slot>
</div>
`;

export class IntercomNetworkElement extends IntercomBaseElement {
    constructor() {
        super();

        this.shadowRoot.append(intercomNetworkTemplate.content.cloneNode(true));

        this.#attachListeners();
    }

    createChain() {
        const newChain = document.createElement("com-chain");
        newChain.parent = this;
        this.appendChild(newChain);
        return newChain
    }

    #attachListeners() {
        this.addEventListener("contextmenu", this.#handleContext.bind(this));
    }

    /**@param {MouseEvent} e */
    #handleContext(e) {
        e.preventDefault();

        let x = e.clientX;
        let y = e.clientY;

        const contextElement = document.createElement("x-context");
        contextElement.style.setProperty("--x", `${x}px`);
        contextElement.style.setProperty("--y", `${y}px`);

        contextElement.innerHTML = `
        <x-momentary name="append chain">add chain</x-momentary>
        `;

        contextElement.addEventListener("input", (e) => {
            if (!(e.target instanceof InputBaseElement)) return;

            switch (e.target.name) {
                case "append chain":
                    const newChain = document.createElement("com-chain");
                    this.append(newChain);
                    contextElement.remove();
                    break;
            }
        });

        document.body.append(contextElement);
    }

    connectedCallback() {}
    disconnectedCallback() {}
}
