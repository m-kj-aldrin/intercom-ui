import { IntercomBaseElement } from "./base.js";

const intercomNetworkTemplate = document.createElement("template");
intercomNetworkTemplate.innerHTML = `
<div id="chains">
    <slot></slot>
</div>
`;

export class IntercomNetworkElement extends IntercomBaseElement {
    constructor() {
        super();

        this.shadowRoot.append(intercomNetworkTemplate.content.cloneNode(true));
    }

    connectedCallback() {}
    disconnectedCallback() {}
}
