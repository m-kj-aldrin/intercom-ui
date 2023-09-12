import { attach_interact_section } from "./interact/index.js";
import { MODULE_TYPES } from "./module.js";
import { signal_to_intercom } from "./signal.js";

export class COMChain extends HTMLElement {
    constructor() {
        super();

        this.attached = false;

        /**@type {HTMLElement} */
        this.moduleList;

        attach_interact_section(this, "chain");
    }

    attach() {
        const button = document.createElement("button");
        button.textContent = "click";
        button.onclick = (e) => {
            this.add_module();
        };

        const list = document.createElement("com-list");
        this.moduleList = list;

        this.append(button, list);

        this.attached = true;
    }

    get index() {
        const parentList = this.closest("com-list") ?? this.parentElement;

        const parentChildren = parentList.children;
        let i = 0;
        for (const child of parentChildren) {
            if (child == this) {
                break;
            }
            i++;
        }

        return i;
    }

    /**@param {keyof typeof MODULE_TYPES} [moduletype]  */
    add_module(moduletype) {
        !this.attached && this.attach();

        const m = document.createElement("com-module");
        m.type(moduletype);

        this.moduleList.appendChild(m);

        signal_to_intercom(`c ${this.index} m ${m.index}`);

        return m;
    }
}
