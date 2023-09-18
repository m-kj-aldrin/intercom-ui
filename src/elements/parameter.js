import COMBase from "./base.js";

/**@param {COMParameter} self */
const template = (self) => `
<label>
    <span>${self.name}</span>
    <input type="text" draggable="true" />
</label>
`;

export default class COMParameter extends COMBase {
    constructor() {
        super();

        this.name = "";
        this.type = "number";
        this.default = null;
        this.value = 0;

        this.template = template;
    }
}
