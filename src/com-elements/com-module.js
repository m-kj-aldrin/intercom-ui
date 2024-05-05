import { CustomInputElement } from "../x-input/src/custom-elements/x-input.js";
import { IntercomBaseElement } from "./base.js";

// -- MODULE TEMPLATES --

const pthModuleTemplate = document.createElement("template");
pthModuleTemplate.innerHTML = `
pth
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
bch
`;

const chaModuleTemplate = document.createElement("template");
chaModuleTemplate.innerHTML = `
cha
`;

const repModuleTemplate = document.createElement("template");
repModuleTemplate.innerHTML = `
rep
`;

const seqModuleTemplate = document.createElement("template");
seqModuleTemplate.innerHTML = `
seq
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

const intercomModuleTemplate = document.createElement("template");
intercomModuleTemplate.innerHTML = `
<style>
    :host{
    }
    #header{
        display: flex;
        gap: 16px;
        justify-content: space-between;
    }
    #operator{
        border-top: 1px currentColor solid;
        padding: 2px 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

</style>
<div id="header">
    <x-input type="select" label="module types" option="grid=true,noLabel=true">
        ${Object.keys(MODULE_TYPE_MAP)
            .map((type) => `<x-option>${type}</x-option>`)
            .join("\n")}
    </x-input>
    <x-input type="momentary" label="remove module" option="noLabel=true">&Cross;<x-input>
</div>
<div id="operator">
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
    }

    /**@param {ModuleTypeNames} type */
    #validType(type) {
        if (Object.keys(MODULE_TYPE_MAP).find((s) => s == type)) {
            return true;
        }
        return false;
    }

    /**@param {ModuleTypeNames} type */
    setType(type) {
        if (!this.#validType(type)) return;

        let typeTemplate = MODULE_TYPE_MAP[type];

        let operatorContainer = this.shadowRoot.querySelector("#operator");
        operatorContainer.innerHTML = "";
        // operatorContainer.childNodes.forEach((node) => node.remove());
        // console.log(operatorContainer.childNodes);

        operatorContainer.append(typeTemplate.content.cloneNode(true));
    }

    /**@param {CustomInputElement} inputElement */
    signalParameter(inputElement) {
        let inputOrderAttr = inputElement.getAttribute("order");
        if (/[0-9]/.test(inputOrderAttr)) {
            let signalString = `parameter -m x:x -v${inputOrderAttr}:${inputElement.value}`;
            console.log(signalString);
        }
    }

    connectedCallback() {}
    disconnectedCallback() {}
}
