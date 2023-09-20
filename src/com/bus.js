/**
 * @param {CustomEvent} e
 */
function hookHandler(name, e) {
    // const c = e.currentTarget.cloneNode(true);

    // console.log(e.currentTarget.index);

    // for (const k in e.currentTarget) {
    //     // console.log(k);
    //     if (k == "_index") {
    //         console.log(k);
    //     }
    //     break;
    //     // if (!(k in c)) {
    //     //     c[k] = e.currentTarget[k];
    //     // }
    // }

    // c.index = e.currentTarget.index;

    e.detail[name] = e.currentTarget;
}

/**
 * @template {HTMLElement}  T
 * @param {T} target
 * @param {string} name
 */
export function attachActionHook(target, name) {
    target.addEventListener("com:element", hookHandler.bind({}, name));
}
