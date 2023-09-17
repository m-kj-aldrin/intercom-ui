import { dragZone, draggable } from "./interact/drag.js";

class COMBase extends HTMLElement {
    constructor() {
        super();

        this.template = () => "";
        this.attached = false;
    }

    render() {
        this.innerHTML = this.template();
    }

    adoptedCallback() {
        console.log(this);
    }

    connectedCallback() {
        // console.log(this);
        if (!this.attached) {
            this.render();
            this.attached = true;
        }
    }
}

export class COMList extends COMBase {
    constructor() {
        super();
    }
}

export class _COMChain extends COMBase {
    constructor() {
        super();

        /**
         * @type {_COMModule[]}
         * @private */
        this._modules = [];

        this.template = () => `
        <x-com-list data-type="chain">
        </x-com-list>
        `;

        dragZone(this, "x-com-module", ["X-COM-MODULE"]);
    }

    /**@param {keyof typeof MODULE_TYPES} [type] */
    addModule(type) {
        const newModule = document.createElement("x-com-module");
        newModule.type = type ?? "PTH";
        draggable(newModule);
        if (this.attached) {
            this.querySelector("x-com-list").appendChild(newModule);
            this._modules.push(newModule);
        }
        return newModule;
    }

    get modules() {
        return this._modules;
    }
}

// - - MODULE - -

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

/**
 *
 * @param {param} pa
 */
function buildParameter(pa) {
    return `
    <form draggable="true" ondragstart="event.preventDefault()">
        <span>${pa.name}</span>
        <input name="${pa.name}" type="range" min="0" max="1" step="0.001"
        data-paramtype="${pa.type}" value="${pa?.value || pa.default}"
        oninput="result.value = (+event.target.value).toFixed(4)">
        <output name="result">${(pa.value || pa.default).toFixed(4)}</output>
    </form>
    `;
    // return `
    // <label>
    //         <span>${pa.name}</span>
    //         <input name="${pa.name}" type="range" max="1" step="0.01"
    //         data-paramtype="${pa.type}" value="${pa?.value || pa.default}"
    //         draggable="true" ondragstart="event.preventDefault()"
    //         oninput="result.value = 3">
    // </label>`;
}

export class _COMModule extends COMBase {
    constructor() {
        super();

        /**@type {keyof typeof MODULE_TYPES} */
        this.type = "PTH";

        this.template = () => `
        <span>${this.type}</span>
        ${
            this.type != "PTH"
                ? `
        <x-com-paramlist>
        ${MODULE_TYPES[this.type].parameters?.map(buildParameter).join("\n")}
        </x-com-paramlist>
        `
                : ""
        } 
        <x-com-list>
        </x-com-list>
        `;

        dragZone(this, "x-com-out", ["X-COM-OUT"], true);
    }

    adoptedCallback() {
        console.log(this);
    }

    addOut() {
        const newOut = document.createElement("x-com-out");
        newOut.index = document.querySelectorAll("x-com-out").length;
        draggable(newOut);
        this.querySelector("x-com-list").appendChild(newOut);
    }
}

export class _COMParameter extends COMBase {
    constructor() {
        super();

        this.name = "";
        this.type = "number";
        this.default = null;
        this.value = 0;

        this.template = () => `
        <label>
            <span>${this.name}</span>
            <input type="text" ondragstart="console.log('y')" draggable="true" />
        </label>
        `;
    }
}

/**@type {Set<_COMOut>} */
export const com_out_list = new Set();

export class _COMOut extends COMBase {
    constructor() {
        super();

        this._index = -1;

        // <span>out: ${this._index}</span>
        this.template = () => `
        <span>
            &DownTeeArrow;
        </span>
        <ul>
        <select>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
        </select>
        <select>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
        </select>
        </ul>
        `;

        com_out_list.add(this);
    }

    /**@param {number} v */
    set index(v) {
        this._index = v;
        if (this.attached) {
            this.render();
        }
    }

    get index() {
        return this._index;
    }
}
