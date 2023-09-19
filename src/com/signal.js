import COMOut from "../elements/out.js";

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

    const module = e.target.closest("com-module");

    start.cIdx = chain.index;
    start.mIdx = module.index;

    if (e.target instanceof COMOut) {
        const out = e.target;
        start.oIdx = out.index;
    }
}

/**@param {import("../interact/drag.js").HTMLDragEvent<DragEvent>} e */
function endHandler(e) {
    const chain = e.target.closest("com-chain");

    const module = e.target.closest("com-module");

    end.cIdx = chain.index;
    end.mIdx = module.index;

    if (e.target instanceof COMOut) {
        COMOut.updateIndices(e.target);
        end.oIdx = e.target.index;
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
