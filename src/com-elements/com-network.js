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
        <x-input type="momentary" option="noLabel=true" label="append chain">add chain</x-input>
        `;

        // contextElement.innerHTML = MODULE_INPUT_TEMPLATE;

        contextElement.addEventListener("input", (e) => {
            switch (e.target.label) {
                case "append chain":
                    const newChain = document.createElement("com-chain");
                    this.append(newChain);
                    contextElement.remove();
                    break;
            }
        });

        document.body.append(contextElement);
    }

    connectedCallback() {
    }
    disconnectedCallback() {}
}
