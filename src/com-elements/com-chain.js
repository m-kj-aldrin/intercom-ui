import { CustomInputElement } from "../x-input/src/custom-elements/x-input.js";
import { IntercomBaseElement } from "./base.js";

const intercomChainTemplate = document.createElement("template");
intercomChainTemplate.innerHTML = `
<div id="header">
    <div id="input-container">
        <div style="font-style:italic;">input &searrow;</div>
        <div class="cv">
            <x-input type="select" label="cv-pid" option="noLabel=false">
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
            </x-input>
            <x-input type="select" label="cv-ch" option="noLabel=false">
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
            </x-input>
        </div>
        <div class="gt">
            <x-input type="select" label="gt-pid" option="noLabel=false">
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
            </x-input>
            <x-input type="select" label="gt-ch" option="noLabel=false">
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
            </x-input>
        </div>
    </div>
    <x-input type="momentary" label="remove chain" option="noLabel=true,square=true">&Cross;</x-input>
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
            if (e.target instanceof CustomInputElement) {
                switch (e.target.label) {
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
            signature += `_`;
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

        return `${this.inputSignature} ${moduleSignatures}`;
    }

    signalChain(remove = false) {
        let cidx = this.index;

        if (remove) {
            let removeSignalString = `chain -r ${cidx}`;
            console.log(removeSignalString);
        } else {
            let newSignalString = `chain -n`;
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
