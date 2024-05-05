import { CustomInputElement } from "../x-input/src/custom-elements/x-input.js";
import { IntercomBaseElement } from "./base.js";

const intercomChainTemplate = document.createElement("template");
intercomChainTemplate.innerHTML = `
<style>
    #header{
        display: flex;
    }
    x-input[label='remove chain']{
        margin-left: auto;
    }
</style>
<div id="header">
    <x-input type="momentary" label="remove chain" option="noLabel=true">&Cross;</x-input>
</div>
<div id="modules">
    <slot></slot>
</div>
`;

export class IntercomChainElement extends IntercomBaseElement {
    constructor() {
        super();

        this.shadowRoot.append(intercomChainTemplate.content.cloneNode(true));

        this.#attachListeners();
    }

    #attachListeners() {
        this.shadowRoot.addEventListener("input", (e) => {
            if (e.target instanceof CustomInputElement) {
                switch (e.target.label) {
                    case "remove chain":
                        this.remove();
                        break;
                }
            }
        });
    }

    signalChain(remove = false) {
        let cidx = this.index;

        if (remove) {
            let removeSignalString = `chain -r ${cidx}`;
            console.log(removeSignalString);
        } else {
            let newSignalString = `chain -n`;
            console.log(newSignalString);
        }
    }

    remove() {
        this.signalChain(true);
        super.remove();
    }

    connectedCallback() {
        let networkParent = this.closest("com-network");
        if (networkParent) {
            this.parent = networkParent;
            this.signalChain();
        }
    }
    disconnectedCallback() {}
}
