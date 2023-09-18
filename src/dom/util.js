/**
 * @param {NodeListOf<HTMLElement> | HTMLCollection} children
 * @param {HTMLElement} child
 */
export function getChildIndex(children, child) {
    let i = 0;
    for (const _child of children) {
        if (_child == child) break;
        i++;
    }
    return i;
}
