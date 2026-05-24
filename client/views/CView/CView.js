
import "../../components/BarChart.js"
import "../../components/RadarChart.js"
import "./components/locationComparison/locationComparison.js"
import "./components/agentDeepDive/agentDeepDive.js"

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
        if(!this.locationView) this.locationView = 4;
    }

    style() {
        return `
            .view {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
        `;
    }

    eListeners() {

/*         // Scroll to A-View
        const aBtn = this.querySelector(".a-view-btn");
        aBtn.addEventListener("click", () => {
            this.scrollView("a");
        });

        // Scroll to B-View
        const bBtn = this.querySelector(".b-view-btn");
        bBtn.addEventListener("click", () => {
            this.scrollView("b");
        });
 */
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
    
    console.log("location:", this.locationView)
    this.shadowRoot.innerHTML = `
        <style>${this.style()}</style>

        <section class="view">
            <location-comparison location="${this.locationView}"></location-comparison>
        </section>
    `;
}
}

customElements.define("c-view", CView);