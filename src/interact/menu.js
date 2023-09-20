import COMChain from "../elements/chain.js";
import COMModule from "../elements/module.js";
import COMOut from "../elements/out.js";

/**
 * @param {import("./drag").HTMLDragEvent<MouseEvent>} e
 */
function dbClickHandler(e) {
    /**@type {COMModule | COMOut} */
    const target = e.target.closest("com-module,com-out");

    if (target) {
        target.classList.add("target-for-deletion");
        target.onclick = (e) => {
            target.remove();
        };

        setTimeout(() => {
            target.classList.remove("target-for-deletion");
            target.onclick = null;
        }, 750);
    }
}

/**@param {import("./drag").HTMLDragEvent<MouseEvent>} e */
function contextClickHandler(e) {
    /**@type {COMChain | COMModule | COMOut} */
    const target = e.target.closest("com-module,com-out");

    e.preventDefault();
}

/**@param {import("./drag").HTMLDragEvent<MouseEvent>} e */
function actionClick(e) {
    /**@type {COMChain | COMModule | COMOut} */
    const target = e.target.closest("com-module,com-out");

    if (e.metaKey) {
        if (target) {
            target.classList.add("target-for-deletion");
            target.onclick = (e) => {
                target.remove();
            };

            setTimeout(() => {
                target.classList.remove("target-for-deletion");
                target.onclick = null;
            }, 750);
        }
    }

    if (e.altKey) {
        if (target) {
            target.classList.add("target-for-add");

            target.onclick = (e) => {
                if (target instanceof COMModule) {
                    target.addOut(true);
                }
            };

            setTimeout(() => {
                target.classList.remove("target-for-add");
                target.onclick = null;
            }, 1500);
        }
    }
}

// document.addEventListener("dblclick", dbClickHandler);
document.addEventListener("contextmenu", contextClickHandler);
document.addEventListener("click", actionClick);
