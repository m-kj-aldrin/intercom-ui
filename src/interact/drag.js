import flip from "./flip.js";

/**
 * @typedef {Object} HTMLTarget
 * @property {HTMLElement} target
 * @property {HTMLElement} currentTarget
 */

/**
 * @template {DragEvent} T
 * @typedef {T & HTMLTarget} HTMLDragEvent
 */

/**@param {HTMLDragEvent<DragEvent>} e */
function dragStart(e) {
    if (e.currentTarget != e.target) return;
    e.currentTarget.classList.add("dragging");
    document.documentElement.classList.add(e.currentTarget.tagName);
    document.documentElement.setAttribute("data-dragging", "true");
}

/**@param {HTMLDragEvent<DragEvent>} e */
function dragEnd(e) {
    e.currentTarget.classList.remove("dragging");
    document.documentElement.classList.remove(e.currentTarget.tagName);
    document.documentElement.removeAttribute("data-dragging");
}

/**
 * @template {HTMLElement} T
 * @param {T} target
 */
export function draggable(target) {
    target.draggable = true;

    target.addEventListener("dragstart", dragStart);
    target.addEventListener("dragend", dragEnd);

    return target;
}

/**
 * @param {NodeListOf<HTMLElement>} children
 * @param {number} y
 * @param {number} [x]
 */
function getClosest(children, y) {
    let closestElement = null;
    let closestoffsetY = Number.NEGATIVE_INFINITY;

    for (const child of children) {
        const childBox = child.getBoundingClientRect();
        const offsetY = y - childBox.top - childBox.height / 2;

        if (offsetY < 0 && offsetY > closestoffsetY) {
            closestElement = child;
            closestoffsetY = offsetY;
        }
    }

    return closestElement;
}

/**
 * @param {string} selector
 * @param {string[]} acceptList
 * @param {boolean} [nosort]
 * */
function dragOver(selector, acceptList, nosort = false) {
    /**@param {HTMLDragEvent<DragEvent>} e */
    return function (e) {
        e.preventDefault();

        const dragged = document.querySelector(".dragging");

        if (
            nosort &&
            e.currentTarget.querySelector("com-list") ==
                dragged.closest("com-list")
        ) {
            return;
        }

        if (!acceptList.find((s) => dragged.tagName == s)) return;

        /**@type {NodeListOf<HTMLElement>} */
        const children = e.currentTarget.querySelectorAll(
            `${selector}:not(.dragging)`
        );

        let closest = null;
        if (!nosort) {
            closest = getClosest(children, e.clientY);
        }

        const fromList = dragged.parentElement;
        const toList = e.currentTarget.querySelector("com-list");

        const F = flip([
            ...toList.children,
            ...(fromList != toList ? fromList.children : []),
        ]);

        if (closest == null) {
            if (dragged == toList.lastElementChild) return;
            console.log(closest);
            toList.appendChild(dragged);
        } else if (closest.previousElementSibling != dragged) {
            toList.insertBefore(dragged, closest);
        }

        F.play();
    };
}

/**
 * @template {HTMLElement} T
 * @param {T} target
 * @param {string} childSelector
 * @param {string[]} acceptList
 * @param {boolean} [nosort]
 */
export function dragZone(target, childSelector, acceptList, nosort) {
    target.addEventListener(
        "dragover",
        dragOver(childSelector, acceptList, nosort)
    );
    return target;
}
