import {
    _COMChain,
    COMList,
    _COMModule,
    _COMOut,
    com_out_list,
} from "./src/el.js";

customElements.define("x-com-list", COMList);
customElements.define("x-com-chain", _COMChain);
customElements.define("x-com-module", _COMModule);
customElements.define("x-com-out", _COMOut);

const networkList = document.createElement("x-com-list");

const c0 = document.createElement("x-com-chain");
const c1 = document.createElement("x-com-chain");

document.body.appendChild(networkList);
networkList.append(c0, c1);

const c0m0 = c0.addModule("LFO");
c0m0.addOut();

const c0m1 = c0.addModule();
c0m1.addOut();

c0.addModule();
c0.addModule();

c1.addModule();
c1.addModule();
c1.addModule();
const c1m2 = c1.addModule("CHA");
c1m2.addOut();
c1m2.addOut();
c1m2.addOut();
c1m2.addOut();
c1m2.addOut();

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

/**
 *
 * @param {NodeListOf<HTMLElement> | HTMLCollection} children
 * @param {HTMLElement} child
 */
function getChildIndex(children, child) {
    let i = 0;
    for (const _child of children) {
        if (_child == child) break;
        i++;
    }
    return i;
}

/**@param {import("./src/interact/drag.js").HTMLDragEvent<DragEvent>} e */
function startHandler(e) {
    const chain = e.target.closest("x-com-chain");
    const chainList = chain.closest("x-com-list");

    const module = e.target;
    const moduleList = e.target.closest("x-com-list");

    start.cIdx = getChildIndex(chainList.children, chain);
    start.mIdx = getChildIndex(moduleList.children, module);

    if (e.target.tagName == "X-COM-OUT") {
        const out = e.target;
        start.oIdx = out.index;
    }
}

/**@param {import("./src/interact/drag.js").HTMLDragEvent<DragEvent>} e */
function endHandler(e) {
    const chain = e.target.closest("x-com-chain");
    const chainList = chain.closest("x-com-list");

    const module = e.target;
    const moduleList = e.target.closest("x-com-list");

    end.cIdx = getChildIndex(chainList.children, chain);
    end.mIdx = getChildIndex(moduleList.children, module);

    if (e.target.tagName == "X-COM-OUT") {
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

    // console.log(start);
    // console.log(end);
}

document.body.addEventListener("dragstart", startHandler);
document.body.addEventListener("dragend", endHandler);
