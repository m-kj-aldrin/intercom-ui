import { dragZone, draggable } from "../interact/drag.js";
import COMBase from "./base.js";

/**@param {COMChain} self */
const template = (self) => `
<com-list data-type="chain" should-index="true">
</com-list>
`;

export default class COMChain extends COMBase {
    constructor() {
        super();

        /**@private */
        this._index = -1;
        this.template = template.bind(null, this);

        dragZone(this, "com-module", ["COM-MODULE"]);
    }

    /**@param {import("./module.js").ModuleTypes} [type] */
    addModule(type) {
        const newModule = document.createElement("com-module");
        newModule.type = type ?? "PTH";
        draggable(newModule);

        this.querySelector("com-list").appendElement(newModule);

        // if (this.attached) {
        //     this.querySelector("com-list").appendChild(newModule);
        // }

        return newModule;
    }

    /**@param {number} v */
    set index(v) {
        if (typeof v != "number") return;
        this._index = v;
    }

    get index() {
        return this._index;
    }
}
