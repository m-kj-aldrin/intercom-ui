import { attachActionHook } from "../com/bus.js";
import { dragZone, draggable } from "../interact/drag.js";
import COMBase from "./base.js";

/**
 * @typedef {Object} param
 * @property {string} name
 * @property {"number"} type
 * @property {number} default
 * @property {number} [value]
 */

const MODULE_TYPES = {
    PTH: {},
    LFO: {
        parameters: [
            {
                name: "AMP",
                type: "number",
                default: 0.5,
            },
            {
                name: "FREQ",
                type: "number",
                default: 0.125,
            },
        ],
    },
    CHA: {
        parameters: [
            {
                name: "CHNS",
                type: "number",
                default: 0.5,
            },
        ],
    },
};

/**@typedef {keyof typeof MODULE_TYPES} ModuleTypes */

/**
 * @param {param} pa
 */
function buildParameter(pa, i) {
    return `
    <form draggable="true" ondragstart="event.preventDefault()">
        <span>${pa.name}</span>
        <input data-param-index="${i}" name="${
        pa.name
    }" type="range" min="0" max="1" step="0.001"
        data-paramtype="${pa.type}" value="${pa?.value || pa.default}"
        oninput="result.value = (+event.target.value).toFixed(4)">
        <output name="result">${(pa.value || pa.default).toFixed(4)}</output>
    </form>
    `;
}

/**@param {COMModule} self */
const template = (self) => {
    let paramString = "";

    if (self.type != "PTH") {
        paramString = `
        <com-paramlist>
        ${MODULE_TYPES[self.type].parameters.map(buildParameter).join("\n")}
        </com-paramlist>
    `;
    }

    return `
        <span>${self.type}</span> 
        ${paramString}
        <com-list>
        </com-list>
`;
};

export default class COMModule extends COMBase {
    constructor() {
        super();

        /**@type {keyof typeof MODULE_TYPES} */
        this.type = "PTH";

        /**@private */
        this._index = -1;

        this.template = template.bind(null, this);

        dragZone(this, "com-out", ["COM-OUT"], true);

        this.addEventListener("change", (e) => {});

        attachActionHook(this, "module");
    }

    /**@param {boolean} signal */
    addOut(signal = false) {
        const newOut = document.createElement("com-out");
        newOut.index = document.querySelectorAll("com-out").length;
        draggable(newOut);

        // console.log("calling addOut", this);

        this.querySelector("com-list").appendElement(newOut, signal);
    }

    set index(v) {
        if (typeof v != "number") return;
        this._index = v;
    }

    get index() {
        return this._index;
    }
}
