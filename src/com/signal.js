import { getChildIndex } from "../dom/util.js";
import { com_out_list } from "../elements/out.js";

const start = {
    cIdx: -1,
    mIdx: -1,
    oIdx: -1,
};

const end = {
    cIdx: -1,
    mIdx: -1,
    oIdx: -1,
};

/**@param {import("../interact/drag.js").HTMLDragEvent<DragEvent>} e */
function startHandler(e) {
    const chain = e.target.closest("com-chain");
    const chainList = chain.closest("com-list");

    const module = e.target;
    const moduleList = e.target.closest("com-list");

    start.cIdx = getChildIndex(chainList.children, chain);
    start.mIdx = getChildIndex(moduleList.children, module);

    if (e.target.tagName == "COM-OUT") {
        const out = e.target;
        start.oIdx = out.index;
    }
}

/**@param {import("../interact/drag.js").HTMLDragEvent<DragEvent>} e */
function endHandler(e) {
    const chain = e.target.closest("com-chain");
    const chainList = chain.closest("com-list");

    const module = e.target;
    const moduleList = e.target.closest("com-list");

    end.cIdx = getChildIndex(chainList.children, chain);
    end.mIdx = getChildIndex(moduleList.children, module);

    if (e.target.tagName == "COM-OUT") {
        const out = e.target;

        com_out_list.delete(e.target);
        com_out_list.add(e.target);

        let i = 0;
        com_out_list.forEach((o) => {
            // console.log(o, i);
            o.index = i;
            i++;
        });

        end.oIdx = out.index;
    }

    console.log(start);
    console.log(end);
}

document.body.addEventListener("dragstart", startHandler);
document.body.addEventListener("dragend", endHandler);

/**
 * @param {string} value
 */
export function signal_to_intercom(value) {
    console.log(`to intercom: ${value}`);
}
