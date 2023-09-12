/** @template {CustomEventInit} T */
export class InteractEvent extends CustomEvent {
    /**
     * @param {string} type
     * @param {T} init
     */
    constructor(type, init) {
        super(`interact:${type}`, {
            detail: {},
            ...init,
            bubbles: true,
        });
    }
}

/**
 * @template {CustomEventInit<{interactSource:HTMLElement,sections:{[x in string]:HTMLElement}}>} T
 * @extends {CustomEvent<{interactSource:HTMLElement,sections:{[x in string]:HTMLElement}}>}
 */
export class InteractRootEvent extends CustomEvent {
    /**
     * @param {string} type
     * @param {T} init
     */
    constructor(type, init) {
        super(`interact-root:${type}`, {
            detail: {
                interactSource: null,
                sections: [],
            },
            ...init,
            bubbles: false,
        });
    }
}

/**@typedef {PointerEvent & {target:HTMLElement,currentTarget:HTMLElement}} HTMLPointerEvent */

/**
 * @template {CustomEvent | Event | PointerEvent} T
 * @typedef {T & {target:HTMLElement,currentTarget:HTMLElement}} HTMLEvent
 */

// - - ROOT - -

/**@param {HTMLEvent<InteractEvent>} e */
function rootInteractDownHandler(e) {
    const emitter_target = e.currentTarget;

    emitter_target.dispatchEvent(
        new InteractRootEvent("down", {
            detail: {
                interactSource: e.target,
                sections: e.detail?.sections,
            },
        })
    );
}

/**@param {HTMLEvent<InteractEvent>} e */
function rootInteractEnterHandler(e) {
    const emitter_target = e.currentTarget;

    emitter_target.dispatchEvent(
        new InteractRootEvent("enter", {
            detail: {
                interactSource: e.target,
                sections: e.detail?.sections,
            },
        })
    );
}

/**@param {HTMLEvent<InteractEvent>} e */
function rootInteractUpHandler(e) {
    const emitter_target = e.currentTarget;

    emitter_target.dispatchEvent(
        new InteractRootEvent("up", {
            detail: {},
        })
    );
}

/**
 * Attaches handler for the root element
 * @param {HTMLElement} target
 */
export function attach_root(target) {
    target.addEventListener("interact:down", rootInteractDownHandler);
    target.addEventListener("interact:enter", rootInteractEnterHandler);
    target.addEventListener("pointerup", rootInteractUpHandler);

    return target;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

//  - - SECTIONS - -

/**@param {HTMLEvent<InteractEvent>} e */
function interactStartSectionHandler(e) {
    if (!e.detail?.sections) {
        e.detail.sections = {
            [e.currentTarget.__interact.name]: e.currentTarget,
        };
        return;
    }

    e.detail.sections[e.currentTarget.__interact.name] = e.currentTarget;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/**
 * @param {HTMLElement} target
 * @param {string} name
 */
export function attach_interact_section(target, name) {
    target.__interact = {
        name,
    };

    target.addEventListener("interact:down", interactStartSectionHandler);
    target.addEventListener("interact:enter", interactStartSectionHandler);
}

// - - EMITTERS - -

/**@param {HTMLEvent<PointerEvent>} e */
function pointerDownHandler(e) {
    const emitter_target = e.currentTarget;

    emitter_target.dispatchEvent(
        new InteractEvent("down", {
            bubbles: true,
        })
    );
}

/**@param {HTMLEvent<PointerEvent>} e */
function pointerEnterHandler(e) {
    const emitter_target = e.currentTarget;

    emitter_target.dispatchEvent(
        new InteractEvent("enter", {
            bubbles: true,
        })
    );
}

/**
 * Attaches handler for the element to be interacted
 * @param {HTMLElement} target
 */
export function attach_interact_emiter(target) {
    target.addEventListener("pointerdown", pointerDownHandler);
    target.addEventListener("pointerenter", pointerEnterHandler);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
