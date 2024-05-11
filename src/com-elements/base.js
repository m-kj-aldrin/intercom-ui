import { getIndexOfChild } from "../x-input/src/utils/dom.js";
import "./importShadowStyle.js";

const intercomBaseTemplate = document.createElement("template");
intercomBaseTemplate.innerHTML = `
`;

export class IntercomBaseElement extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open", delegatesFocus: true });

        this.shadowRoot.adoptedStyleSheets = document.adoptedStyleSheets;

        // this.shadowRoot.append(intercomBaseTemplate.content.cloneNode(true));
    }

    /**@param {IntercomBaseElement[]} child */
    insertChild(...child) {
        child.forEach((c) => (c.parent = this));
        this.append(...child);
    }

    /**@type {IntercomBaseElement} */
    #parent;
    get parent() {
        return this.#parent;
    }
    set parent(parent) {
        this.#parent = parent;
    }

    get index() {
        return getIndexOfChild(this.#parent, this);
    }

    connectedCallback() {}
    disconnectedCallback() {}
}
