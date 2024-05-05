import { IntercomBaseElement } from "./base.js";

const intercomNetworkTemplate = document.createElement("template");
intercomNetworkTemplate.innerHTML = `
<style>
    #chains{
        flex-grow: 1;
    }
</style>
<div id="chains" class="h-list">
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
