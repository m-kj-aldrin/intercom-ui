import { InputBaseElement } from "../x-input/src/custom-elements/base.js";
import { CustomSelectElement } from "../x-input/src/custom-elements/x-select.js";
import { waitForDomUpdate } from "../x-input/src/utils/dom.js";
import { IntercomBaseElement } from "./base.js";
import { IntercomChainElement } from "./com-chain.js";

// -- MODULE TEMPLATES --

const pthModuleTemplate = document.createElement("template");
pthModuleTemplate.innerHTML = `
<div></div>
`;

const lfoModuleTemplate = document.createElement("template");
lfoModuleTemplate.innerHTML = `
<x-select order="0"  showOutput="true" label="amp">
    <x-option value="0">square</x-option>
    <x-option value="1" selected>sine</x-option>
    <x-option value="2">ramp up</x-option>
    <x-option value="3">ramp down</x-option>
</x-select>
<x-range order="1" showOutput="true" max="2000" value="20" label="frq"></x-range>
<x-range order="2" showOutput="true" max="1" step="0.01" value="0.5" label="amp"></x-range>
`;

const bchModuleTemplate = document.createElement("template");
bchModuleTemplate.innerHTML = `
<div>...</div>
`;

const chaModuleTemplate = document.createElement("template");
chaModuleTemplate.innerHTML = `
<x-range order="0" showOutput="true" max="1" step="0.01" value="0.5" label="chs"></x-range>
`;

const repModuleTemplate = document.createElement("template");
repModuleTemplate.innerHTML = `
<div>...</div>
`;

const seqModuleTemplate = document.createElement("template");
seqModuleTemplate.innerHTML = `
<div>...</div>
`;

const MODULE_TYPE_MAP = {
    pth: pthModuleTemplate,
    lfo: lfoModuleTemplate,
    bch: bchModuleTemplate,
    cha: chaModuleTemplate,
    rep: repModuleTemplate,
    seq: seqModuleTemplate,
};

/**
 * @typedef {keyof typeof MODULE_TYPE_MAP} ModuleTypeNames
 */

// -- MODULE TEMPLATES --

export const MODULE_INPUT_TEMPLATE = `
<x-select name="module select" grid >
${Object.keys(MODULE_TYPE_MAP)
        .map((type, i) => `<x-option>${type}</x-option>`)
        .join("\n")}
</x-select>
`;

const intercomModuleTemplate = document.createElement("template");
intercomModuleTemplate.innerHTML = `
<div id="header">
    <div id="out-container"></div>
</div>
<div id="operator" class="v-list"></div>
`;

export class IntercomModuleElement extends IntercomBaseElement {
    /**@type {CustomSelectElement} */
    #moduleSelect = null

    constructor() {
        super();

        let moduleSelect = document.createElement('x-select');
        this.#moduleSelect = moduleSelect

        moduleSelect.name = "module select"
        moduleSelect.setOption({ grid: true })
        moduleSelect.innerHTML = `
        ${Object.keys(MODULE_TYPE_MAP)
                .map((type, i) => `<x-option>${type}</x-option>`)
                .join("\n")}
        `

        this.shadowRoot.append(intercomModuleTemplate.content.cloneNode(true));

        this.shadowRoot.querySelector("#header").prepend(moduleSelect)

        let typeAttr = this.getAttribute("type");

        this.setType(typeAttr);

        this.#attachListeners();
    }

    get signature() {
        let parameters = this.shadowRoot.querySelector("#operator").querySelectorAll("x-momentary,x-toggle,x-select,x-range,x-number");

        let parametersSignature = [...parameters]
            .map((parameter) => {
                return `${parameter.value}`;
            })
            .join(":");

        let moduleSignature = `${this.#type} ${parametersSignature}`.replaceAll(
            " ",
            ""
        );


        return moduleSignature
    }

    #attachListeners() {
        this.shadowRoot
            .querySelector("#header")
            .addEventListener("input", (e) => {
                if (!(e.target instanceof InputBaseElement)) return;

                switch (e.target.name) {
                    case "remove module":
                        this.remove();
                        break;
                    case "module select":
                        this.setType(e.target.value);
                        break;
                }
            });

        this.shadowRoot
            .querySelector("#operator")
            .addEventListener("input", (e) => {
                if (e.target instanceof InputBaseElement) {
                    this.signalParameter(e.target);
                }
            });

        this.addEventListener("contextmenu", this.#handleContext.bind(this));
    }

    /**@param {MouseEvent} e */
    #handleContext(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        let x = e.clientX;
        let y = e.clientY;

        const contextElement = document.createElement("x-context");
        contextElement.style.setProperty("--x", `${x}px`);
        contextElement.style.setProperty("--y", `${y}px`);

        contextElement.innerHTML = `
        <x-momentary name="remove module">remove module</x-momentary>
        <x-momentary name="add out">add out</x-momentary>
        `;

        contextElement.addEventListener("input", (e) => {
            switch (e.target.label) {
                case "remove module":
                    contextElement.remove();
                    this.remove();
                    break;
                case "add out":
                    const newOut = document.createElement("com-out")
                    const outContainer = this.shadowRoot.querySelector("#out-container")
                    outContainer.append(newOut)
            }
        });

        document.body.append(contextElement);
    }

    /**@param {ModuleTypeNames} type */
    #validType(type) {
        if (Object.keys(MODULE_TYPE_MAP).find((s) => s == type)) {
            return true;
        }
        return false;
    }

    /**@type {ModuleTypeNames} */
    #type = "pth";

    /**@param {ModuleTypeNames} type */
    setType(type) {
        if (!this.#validType(type)) return;

        this.#type = type;
        this.#moduleSelect.value = type

        let typeTemplate = MODULE_TYPE_MAP[type];

        let operatorContainer = this.shadowRoot.querySelector("#operator");
        operatorContainer.innerHTML = "";

        let moduleClone = typeTemplate.content.cloneNode(true);

        operatorContainer.append(moduleClone);

        if (this.parent) {
            this.signalModule();
        }
        return this;
    }

    #attached = false;

    signalModule(insert = true) {
        let cidx = this.parent.index;
        let midx = this.index;

        if (this.#attached) {
            let removeSignalString = `module -c ${cidx} -r ${midx}`;
            console.log(removeSignalString);
        }
        if (insert) {

            let insertSignalString = `module -c ${cidx} -i ${midx} ${this.signature
                }`;
            console.log(insertSignalString);
            this.#attached = true;
        }
    }

    /**@param {InputBaseElement} inputElement */
    signalParameter(inputElement) {
        let inputOrderAttr = inputElement.getAttribute("order");
        if (/[0-9]/.test(inputOrderAttr)) {
            let cidx = this.parent.index;
            let midx = this.index;
            let pidx = +inputOrderAttr;

            let signalString = `parameter -m ${cidx}:${midx} -v${pidx}:${inputElement.value}`;

            console.log(signalString);
        }
    }

    remove() {
        this.signalModule(false);
        super.remove();
    }

    // get parent(){
    //     return super.parent
    // }
    // /**@param {IntercomChainElement} parent */
    // set parent(parent){
    //     super.parent = parent
    // }

    connectedCallback() {
        let chainParent = this.closest("com-chain");
        if (chainParent) {
            this.parent = chainParent;

            waitForDomUpdate().then(s => this.signalModule())
        }
    }
    disconnectedCallback() { }
}
