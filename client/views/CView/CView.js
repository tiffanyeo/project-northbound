
import "../../components/BarChart.js"
import "../../components/RadarChart.js"
import "./components/locationComparison/locationComparison.js"
import "./components/agentDeepDive/agentDeepDive.js"

export class CView extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
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

    render() {
        this.locationView = this.getAttribute("locationView");
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