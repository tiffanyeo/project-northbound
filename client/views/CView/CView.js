
import "./components/locationComparison/locationComparison.js"

class CView extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.locationView = this.getAttribute("locationView");
    }

    connectedCallback() {
        this.render();
        this.eListeners();
        
        
        // DEV
        if(!this.locationView) this.locationView = 1;
    }

    style() {
        return `
            .view {
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                background-color: darkcyan;
            }
        `;
    }

    eListeners() {

        // Scroll to A-View
        const aBtn = this.querySelector(".a-view-btn");
        aBtn.addEventListener("click", () => {
            this.scrollView("a");
        });

        // Scroll to B-View
        const bBtn = this.querySelector(".b-view-btn");
        bBtn.addEventListener("click", () => {
            this.scrollView("b");
        });

    }

    scrollView(view) {
        if (view == "a") {
            const aView = document.getElementById("AView");
            aView.scrollIntoView({ behavior: "smooth" });
        } else if (view == "a") {
            const bView = document.getElementById("BView");
            bView.scrollIntoView({ behavior: "smooth" });
        }
    }

    render() {
        this.innerHTML = `
            <style>${this.style()}</style>

            <section class="view">
                <h1>View C</h1>
                <location-comparison location="${this.locationView}"></location-comparison>
                <button id="a-view">Show locations</button>
            </section>
        `;
    }
}

customElements.define("c-view", CView);