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

    connectedCallback() {
        if (!this.attached) {
            this.render();
            this.attached = true;
        }
    }
}
