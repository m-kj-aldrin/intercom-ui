import { IntercomBaseElement } from "./base.js";

const intercomChainTemplate = document.createElement("template");
intercomChainTemplate.innerHTML = `
<div id="modules">
    <slot></slot>
</div>
`;

export class IntercomChainElement extends IntercomBaseElement {
    constructor() {
        super();

        this.shadowRoot.append(intercomChainTemplate.content.cloneNode(true));
    }

    connectedCallback() {}
    disconnectedCallback() {}
}
