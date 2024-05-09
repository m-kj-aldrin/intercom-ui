import { CustomInputElement } from "../x-input/src/custom-elements/x-input.js";
import { waitForDomUpdate } from "../x-input/src/utils/dom.js";
import { IntercomBaseElement } from "./base.js";

// -- MODULE TEMPLATES --

const pthModuleTemplate = document.createElement("template");
pthModuleTemplate.innerHTML = `
<div></div>
`;

const lfoModuleTemplate = document.createElement("template");
lfoModuleTemplate.innerHTML = `
<x-input order="0" type="select" option="showOutput=true" label="amp">
    <x-option value="0">square</x-option>
    <x-option value="1" selected>sine</x-option>
    <x-option value="2">ramp up</x-option>
    <x-option value="3">ramp down</x-option>
</x-input>
<x-input order="1" type="range" option="showOutput=true,max=2000,value=20" label="frq"></x-input>
<x-input order="2" type="range" option="showOutput=true,max=1,step=0.01,value=0.5" label="amp"></x-input>
`;

const bchModuleTemplate = document.createElement("template");
bchModuleTemplate.innerHTML = `
<div>...</div>
`;

const chaModuleTemplate = document.createElement("template");
chaModuleTemplate.innerHTML = `
<x-input order="0" type="range" option="showOutput=true,max=1,step=0.01,value=0.5" label="chs"></x-input>
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
const MODULE_TYPE_ENUM = {
    pth: 0,
    lfo: 1,
    bch: 2,
    cha: 3,
    rep: 4,
    seq: 5,
};

/**
 * @typedef {keyof typeof MODULE_TYPE_MAP} ModuleTypeNames
 */

// -- MODULE TEMPLATES --

export const MODULE_INPUT_TEMPLATE = `
<x-input type="select" label="module types" option="grid=true,noLabel=true">
    ${Object.keys(MODULE_TYPE_MAP)
        .map((type, i) => `<x-option>${type}</x-option>`)
        .join("\n")}
</x-input>
`;

const intercomModuleTemplate = document.createElement("template");
intercomModuleTemplate.innerHTML = `
<div id="header">
    <x-input type="select" label="module types" option="grid=true,noLabel=true">
        ${Object.keys(MODULE_TYPE_MAP)
            .map((type, i) => `<x-option>${type}</x-option>`)
            .join("\n")}
    </x-input>
    <!-- <x-input type="momentary" label="remove module" option="noLabel=true,square=true">&Cross;<x-input> -->
</div>
<div id="operator" class="v-list">
</div>
`;

export class IntercomModuleElement extends IntercomBaseElement {
    constructor() {
        super();

        this.shadowRoot.append(intercomModuleTemplate.content.cloneNode(true));

        let typeAttr = this.getAttribute("type");

        this.setType(typeAttr);

        this.#attachListeners();
    }

    get signature() {
        let parameters = this.querySelectorAll("x-input");

        let parametersSignature = [...parameters]
            .map((parameter) => {
                return `${parameter.value}`;
            })
            .join(":");

        let moduleSignature = `${this.#type} ${parametersSignature}`.replaceAll(
            " ",
            ""
        );

        return moduleSignature;
    }

    #attachListeners() {
        this.shadowRoot
            .querySelector("#header")
            .addEventListener("input", (e) => {
                switch (e.target.label) {
                    case "remove module":
                        this.remove();
                        break;
                    case "module types":
                        this.setType(e.target.value);
                        break;
                }
            });

        this.shadowRoot
            .querySelector("#operator")
            .addEventListener("input", (e) => {
                if (e.target instanceof CustomInputElement) {
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
        <x-input type="momentary" label="remove module" option="noLabel=true">remove module</x-input>
        `;

        contextElement.addEventListener("input", (e) => {
            switch (e.target.label) {
                case "remove module":
                    contextElement.remove();
                    this.remove();
                    break;
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

        let typeTemplate = MODULE_TYPE_MAP[type];

        let operatorContainer = this.shadowRoot.querySelector("#operator");
        operatorContainer.innerHTML = "";
        // operatorContainer.childNodes.forEach((node) => node.remove());
        // console.log(operatorContainer.childNodes);

        operatorContainer.append(typeTemplate.content.cloneNode(true));

        this.#type = type;
        let moduleTypeSelect = this.shadowRoot.querySelector(
            "#header [label='module types']"
        );
        moduleTypeSelect.value = type
        moduleTypeSelect.setAttribute("value", this.#type);
        // moduleTypeSelect.value = this.#type;
        // console.log(moduleTypeSelect.value);
        // waitForDomUpdate().then((_) => (moduleTypeSelect.value = this.#type));

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
            let insertSignalString = `module -c ${cidx} -i ${midx} ${
                this.#type
            }`;
            console.log(insertSignalString);
            this.#attached = true;
        }
    }

    /**@param {CustomInputElement} inputElement */
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

    connectedCallback() {
        let chainParent = this.closest("com-chain");
        if (chainParent) {
            this.parent = chainParent;

            // let s = this.shadowRoot.querySelector(
            //     "x-input[label='module types']"
            // );

            // console.log("inp el", s, this.#type,s.value);

            // setTimeout(() => {
            //     s.value = "lfo";
            // }, 100);

            this.signalModule();
        }
    }
    disconnectedCallback() {}
}
