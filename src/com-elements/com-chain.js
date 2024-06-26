import { InputBaseElement } from "../x-input/src/custom-elements/base.js";
import { getChildByIndex } from "../x-input/src/utils/dom.js";
import { IntercomBaseElement } from "./base.js";
import { IntercomModuleElement } from "./com-module.js";

export const PERIPHERAL_TEMPLATE = /**@param{"cv"|"gt"} cvOrGt */ (cvOrGt) => `
<x-select name="${cvOrGt}-pid" label="pid" blank-start>
    <x-option value="1">dac</x-option>
    <x-option value="2">adc</x-option>
    <x-option value="3">dout</x-option>
    <x-option value="4">din</x-option>
    <x-option value="5">MIDI_1</x-option>
    <x-option value="6">MIDI_2</x-option>
    <x-option value="7">MIDI_3</x-option>
    <x-option value="8">MIDI_DEV</x-option>
    <x-option value="9">MIDI_HOST</x-option>
    <x-option value="10">I2C_1</x-option>
    <x-option value="11">I2C_2</x-option>
    <x-option value="12">osc</x-option>
    <x-option value="13">none</x-option>
</x-select>
<x-select name="${cvOrGt}-ch" label="ch" blank-start>
    <x-option>1</x-option>
    <x-option>2</x-option>
    <x-option>3</x-option>
    <x-option>4</x-option>
    <x-option>5</x-option>
    <x-option>6</x-option>
    <x-option>7</x-option>
    <x-option>8</x-option>
    <x-option>9</x-option>
    <x-option>10</x-option>
    <x-option>11</x-option>
    <x-option>12</x-option>
    <x-option>13</x-option>
    <x-option>14</x-option>
    <x-option>15</x-option>
    <x-option>16</x-option>
</x-select>
`;

const intercomChainTemplate = document.createElement("template");
intercomChainTemplate.innerHTML = `
<div id="header">
    <div id="input-container">
        <div style="font-style:italic;">input &searrow;</div>
        <div class="cv">
            <div>cv:</div>
            ${PERIPHERAL_TEMPLATE("cv")}
        </div>
        <div class="gt">
            <div>gt:</div>
            ${PERIPHERAL_TEMPLATE("gt")}
        </div>
    </div>
</div>
<div id="modules" class="v-list">
    <slot></slot>
</div>
`;

export class IntercomChainElement extends IntercomBaseElement {
    constructor() {
        super();

        this.shadowRoot.append(intercomChainTemplate.content.cloneNode(true));

        this.#attachListeners();
    }

    /**@param {import("./com-module.js").ModuleTypeNames} typeName */
    appendModule(typeName) {
        const newModule = document.createElement("com-module");
        this.appendChild(newModule);
        newModule.setType(typeName);
        newModule.signalModule("append");

        return newModule;
    }
    /**
     * @param {IntercomModuleElement | import("./com-module.js").ModuleTypeNames} moduleOrTypeName
     * @param {number|HTMLElement} [index]
     */
    insertModule(moduleOrTypeName, index) {
        /**@type {IntercomModuleElement} */
        let returnElement;

        if (moduleOrTypeName instanceof IntercomModuleElement) {
            moduleOrTypeName.remove();

            if (index instanceof HTMLElement) {
                this.insertBefore(moduleOrTypeName, index);
            } else {
                this.insertBefore(
                    moduleOrTypeName,
                    getChildByIndex(this, index)
                );
            }

            moduleOrTypeName.signalModule("insert");

            returnElement = moduleOrTypeName;
        } else {
            const newModule = document.createElement("com-module");

            if (index instanceof HTMLElement) {
                this.insertBefore(newModule, index);
            } else {
                this.insertBefore(newModule, getChildByIndex(this, index));
            }

            newModule.setType(moduleOrTypeName);

            newModule.signalModule("insert");

            returnElement = newModule;
        }

        return returnElement;
    }

    /**@type {string|number} */
    #inputCvPid = null;
    /**@type {string|number} */
    #inputGtPid = null;
    /**@type {string|number} */
    #inputCvCh = null;
    /**@type {string|number} */
    #inputGtCh = null;

    #attachListeners() {
        this.shadowRoot.addEventListener("input", (e) => {
            if (e.target instanceof InputBaseElement) {
                switch (e.target.name) {
                    case "remove chain":
                        this.remove();
                        break;
                    case "cv-pid":
                        this.#inputCvPid = e.target.value;
                        this.signalInput();
                        break;
                    case "cv-ch":
                        this.#inputCvCh = e.target.value;
                        this.signalInput();
                        break;
                    case "gt-pid":
                        this.#inputGtPid = e.target.value;
                        this.signalInput();
                        break;
                    case "gt-ch":
                        this.#inputGtCh = e.target.value;
                        this.signalInput();
                        break;
                }
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

        let closestElement = this.#getClosestModule(x, y);

        const contextElement = document.createElement("x-context");
        contextElement.style.setProperty("--x", `${x}px`);
        contextElement.style.setProperty("--y", `${y}px`);

        contextElement.innerHTML = `
        <x-momentary name="remove chain">remove chain</x-momentary>
        <x-select name="insert module" grid static-label>
            <x-option>pth</x-option>
            <x-option>lfo</x-option>
            <x-option>bch</x-option>
            <x-option>cha</x-option>
            <x-option>seq</x-option>
            <x-option>rep</x-option>
        </x-select>
        `;

        contextElement.addEventListener("input", (e) => {
            if (!(e.target instanceof InputBaseElement)) return;

            switch (e.target.name) {
                case "insert module":
                    // const newModule = document.createElement("com-module");
                    // this.insertBefore(newModule, closestElement);
                    // newModule.setType(e.target.value);
                    this.insertModule(e.target.value, closestElement);
                    contextElement.remove();
                    break;
                case "remove chain":
                    this.remove();
                    contextElement.remove();
            }
        });

        document.body.append(contextElement);
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    #getClosestModule(x, y) {
        let children = this.querySelectorAll("com-module");
        if (children.length) {
            let closestElement = [...children].reduce((closest, current) => {
                let closestBox = closest.getBoundingClientRect();
                let currentBox = current.getBoundingClientRect();

                let yClosestDiff = Math.abs(y - closestBox.y);
                let yCurrentDiff = Math.abs(y - currentBox.y);

                if (yCurrentDiff < yClosestDiff) {
                    return current;
                }

                return closest;
            });

            if (closestElement.getBoundingClientRect().y < y) {
                return null;
            }

            return closestElement;
        }
        return null;
    }

    signalInput() {
        let cidx = this.index;

        let signalString = `chain -e ${cidx} ${this.signature}`;

        console.log(signalString);
    }

    get inputSignature() {
        let signature = "";
        if (this.#inputCvPid) {
            signature += `cv${this.#inputCvPid}`;
        } else {
            signature += `cv_`;
        }
        if (this.#inputCvCh) {
            signature += `:${this.#inputCvCh}`;
        } else {
            signature += `:_`;
        }
        if (this.#inputGtPid) {
            signature += `,gt${this.#inputGtPid}`;
        } else {
            signature += `,gt_`;
        }
        if (this.#inputGtCh) {
            signature += `:${this.#inputGtCh}`;
        } else {
            signature += `:_`;
        }

        return signature;
    }

    get signature() {
        let modules = this.querySelectorAll("com-module");
        let moduleSignatures = [...modules]
            .map((module) => {
                return `${module.signature}`;
            })
            .join(",");

        return `${this.inputSignature}>${moduleSignatures}`;
    }

    signalChain(remove = false) {
        let cidx = this.index;

        if (remove) {
            let removeSignalString = `chain -r ${cidx}`;
            console.log(removeSignalString);
        } else {
            let newSignalString = `chain -n ${this.signature}`;
            console.log(newSignalString);
        }
    }

    remove() {
        this.signalChain(true);
        super.remove();
    }

    connectedCallback() {
        let networkParent = this.closest("com-network");
        if (networkParent) {
            this.parent = networkParent;
            this.signalChain();
        }
    }
    disconnectedCallback() {}
}
