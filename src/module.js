import { attach_interact_emiter } from "./interact/index.js";

export const MODULE_TYPES = {
    PTH: {},
    LFO: {
        parameters: [
            {
                name: "AMP",
                type: "number",
            },
            {
                name: "FREQUENCY",
                type: "number",
            },
        ],
    },
};

/**
 *
 * @param {{name:string,type:string}[]} signature
 * @returns {string}
 */
function buildModuleParameters(signature) {
    let htmlString = "";

    signature.forEach((paramter) => {
        htmlString += `
        <label>
        <span>${paramter.name}</span>
        <input type="text">
        </label>
        `;
    });

    return htmlString;
}

export class COMModule extends HTMLElement {
    constructor() {
        super();

        attach_interact_emiter(this);

        /**@type {keyof typeof MODULE_TYPES} */
        this.moduleType;
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

    /**@param {keyof typeof MODULE_TYPES} [type] */
    type(type = "PTH") {
        this.moduleType = type;

        this.innerHTML = `
        <span>${type}</span>
        `;

        if (type != "PTH") {
            this.innerHTML += buildModuleParameters(
                MODULE_TYPES[type].parameters
            );
        }
    }
}
