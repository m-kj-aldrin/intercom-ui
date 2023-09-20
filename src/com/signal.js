import COMChain from "../elements/chain.js";
import COMModule from "../elements/module.js";
import COMOut from "../elements/out.js";
import COMParameter from "../elements/parameter.js";

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

    if (e.target.nextElementSibling) {
        signal_to_intercom(signalInsert(e.target)(chain, module));
    } else {
        signal_to_intercom(signalAppend(e.target)(chain, module));
    }
}

document.body.addEventListener("dragstart", startHandler);
document.body.addEventListener("dragend", endHandler);

/**
 * @param {import("../interact/drag.js").HTMLDragEvent<InputEvent>} e
 */
function changeHandler(e) {
    const chain = e.target.closest("com-chain");
    const module = e.target.closest("com-module");

    signal_to_intercom(signalParameterChange(e.target)(chain, module));
}

document.body.addEventListener("change", changeHandler);

/**
 * @param {string} value
 */
export function signal_to_intercom(value) {
    console.log(`→      ${value}`);
}

/**
 * @param {import("../elements/index.js").COMUnion} element
 */
function signalInsert(element) {
    if (element instanceof COMModule) {
        return (parent) => `I c ${parent.index} m ${element.index}`;
    }
    if (element instanceof COMOut) {
        return (parent, module) =>
            `I c ${parent.index} m ${module.index} o ${element.index}`;
    }
}

/**
 * @param {import("../elements/index.js").COMUnion} element
 */
function signalAppend(element) {
    if (element instanceof COMChain) {
        return () => `A c ${element.index}`;
    }
    if (element instanceof COMModule) {
        return (parent) => `A c ${parent.index} m ${element.index}`;
    }
    if (element instanceof COMOut) {
        return (parent, module) =>
            `A c ${parent.index} m ${module.index} o ${element.index}`;
    }
}

/**
 *
 * @param {COMParameter} param
 */
function signalParameterChange(param) {
    return (chain, module) =>
        `c ${chain.index} m ${module.index} ${param.value}`;
}

/**
 *
 * @param {CustomEvent} e
 */
function elementActionHandler(e) {
    const { chain, module, target } = e.detail;
    switch (e.detail.action) {
        case "append":
            signal_to_intercom(signalAppend(target)(chain, module));
            break;
        case "insert":
            signal_to_intercom(signalInsert(target)(chain, module));
            break;
    }
}

document.addEventListener("com:element", elementActionHandler);
