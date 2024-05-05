import "./importShadowStyle.js";

const intercomBaseTemplate = document.createElement("template");
intercomBaseTemplate.innerHTML = `

`;

export class IntercomBaseElement extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open", delegatesFocus: true });

        this.shadowRoot.adoptedStyleSheets = document.adoptedStyleSheets;

        this.shadowRoot.append(intercomBaseTemplate.content.cloneNode(true));
    }

    connectedCallback() {}
    disconnectedCallback() {}
}
