import { dragZone, draggable } from "../interact/drag.js";
import COMBase from "./base.js";

/**@param {COMChain} self */
const template = (self) => `
<com-list data-type="chain">
</com-list>
`;

export default class COMChain extends COMBase {
    constructor() {
        super();

        /**
         * @type {import("./module.js").default[]}
         * @private
         */
        this._modules = [];

        this.template = template.bind(null, this);

        dragZone(this, "com-module", ["COM-MODULE"]);
    }

    /**@param {import("./module.js").ModuleTypes} [type] */
    addModule(type) {
        const newModule = document.createElement("com-module");
        newModule.type = type ?? "PTH";
        draggable(newModule);
        if (this.attached) {
            this.querySelector("com-list").appendChild(newModule);
            this._modules.push(newModule);
        }
        return newModule;
    }

    get modules() {
        return this._modules;
    }
}
