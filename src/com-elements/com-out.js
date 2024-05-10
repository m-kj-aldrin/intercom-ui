import { IntercomBaseElement } from "./base.js";
import { IntercomModuleElement } from "./com-module.js";

/**@type {} */
const intercomOutSet = new Set()

const intercomOutElementTemplate = document.createElement("template")
intercomOutElementTemplate.innerHTML = `
<div>out</div>
`

export class IntercomOutElement extends IntercomBaseElement {
    constructor() {
        super()


        this.shadowRoot.append(intercomOutElementTemplate.content.cloneNode(true))
    }

    /**@type {IntercomModuleElement} */
    #parent = null

    get parent(){
        return this.#parent
    }
    set parent(parent){
        this.#parent = parent
    }

    signalOut(){
        let cidx = this.#parent.parent.index
        let midx = this.#parent.index

        let signalString = ``
    }

    connectedCallback() { }
    disconnectedCallback() { }
}
