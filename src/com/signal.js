import COMChain from "../elements/chain.js";
import { extractContext } from "../elements/list.js";
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

    signal_to_intercom(signalRemove(start)());

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
        return (parent) => `c ${parent.index} m ${element.index} -i`;
    }
    if (element instanceof COMOut) {
        return (parent, module) => `c ${parent.index} m ${module.index} o -i`;
    }
}

/**
 * @param {import("../elements/index.js").COMUnion} element
 */
function signalAppend(element) {
    if (element instanceof COMChain) {
        return () => `c ${element.index} -a`;
    }
    if (element instanceof COMModule) {
        return (parent) => `c ${parent.index} m ${element.index} -a`;
    }
    if (element instanceof COMOut) {
        return (parent, module) => `c ${parent.index} m ${module.index} o -a`;
    }
}

function signalRemove(context) {
    if (context?.oIdx == -1) {
        return () => `c ${context.cIdx} m ${context.mIdx} -r`;
    } else {
        return () => `o ${context.oIdx} -r`;
    }
}

/**
 *
 * @param {COMParameter} param
 */
function signalParameterChange(param) {
    return (chain, module) =>
        `c ${chain.index} m ${module.index} [ ${param.getAttribute(
            "data-param-index"
        )} , ${param.value} ]`;
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
            // signal_to_intercom(signalInsert(target)(chain, module));
            break;
        case "remove":
            if (e.target instanceof COMOut) {
                signal_to_intercom(
                    signalRemove({
                        mIdx: e.detail.module?.index,
                        cIdx: e.detail.chain?.index,
                        oIdx: e.target.index,
                    })()
                );
                return;
            }

            signal_to_intercom(
                signalRemove({
                    mIdx: e.target.index,
                    cIdx: e.detail.chain?.index,
                    oIdx: -1,
                })()
            );
            // console.log("r", e.detail.chain.index, e.detail.target.index);
            // console.log(e.detail);
            // console.log(e.detail.chain.index, e.detail.module.index);
            break;
    }
}

document.addEventListener("com:element", elementActionHandler);
