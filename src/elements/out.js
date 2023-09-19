import COMBase from "./base.js";

/**@param {COMOut} self */
const template = (self) => `
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

/**@type {Set<COMOut>} */
export const com_out_list = new Set();

export default class COMOut extends COMBase {
    /**@param {COMOut} target */
    static updateIndices(target) {
        com_out_list.delete(target);
        com_out_list.add(target);

        let i = 0;
        com_out_list.forEach((o) => {
            o.index = i;
            i++;
        });
    }

    constructor() {
        super();

        this._index = -1;

        this.template = template.bind(null, this);

        com_out_list.add(this);
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
