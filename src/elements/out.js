import COMBase from "./base.js";

/**@param {COMOut} self */
const template = (self) => {
    const list = [...Array(16)].map((_, i) => {
        return `<option value="${i}">${i}</option>`;
    });

    return `
<span>
    &DownTeeArrow;
</span>
<ul>
    <select>
        ${list.join("\n")}
    </select>
    <select>
        ${list.join("\n")}
    </select>
</ul>
`;
};

/**@type {Set<COMOut>} */
export const com_out_list = new Set();

export default class COMOut extends COMBase {
    /**@param {COMOut} [target] */
    static updateIndices(target) {
        if (target) {
            com_out_list.delete(target);
            com_out_list.add(target);
        }

        com_out_list.forEach((o) => {
            if (!o.isConnected) {
                com_out_list.delete(o);
            }
        });

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

        // console.log("out constructor", this);
        com_out_list.add(this);
    }

    /**@param {number} v */
    set index(v) {
        if (typeof v != "number") return;
        // console.log(v);
        this._index = v;
    }

    get index() {
        return this._index;
    }
}
