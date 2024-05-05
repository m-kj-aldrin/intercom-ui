import { IntercomBaseElement } from "./base.js";

const intercomParameterTemplate = document.createElement("template");
intercomParameterTemplate.innerHTML = `
para
`;

export class IntercomParameterElement extends IntercomBaseElement {
    constructor() {
        super();

        this.shadowRoot.append(
            intercomParameterTemplate.content.cloneNode(true)
        );
    }

    connectedCallback() {}
    disconnectedCallback() {}
}
