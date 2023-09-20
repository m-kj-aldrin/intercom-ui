export default class COMBase extends HTMLElement {
    constructor() {
        super();

        /**@type {(...args:any[]) => string} self */
        this.template = () => "";
        this.attached = false;
    }

    render() {
        this.innerHTML = this.template();
    }
    remove() {
        this.dispatchEvent(
            new CustomEvent("com:element", {
                bubbles: true,
                detail: {
                    target: this,
                    action: "remove",
                },
            })
        );

        this.parentElement.removeChild(this);
    }

    connectedCallback() {
        if (!this.attached) {
            this.render();
            this.attached = true;
        }
    }
}
