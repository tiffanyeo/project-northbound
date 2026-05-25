
import { Agents } from "../../../../services/Agents/Agents.js";
import { CService } from "../../CViewService.js";
import "../../../../components/RadarChart.js"

export class LocationComparison extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.location = Number(this.getAttribute("location")) || 1;
        this.comparison = "all";

        this.render();
        this.eListeners();
        this.updateTitle();
        this.setupTooltip();

        this.buildCountryCharts();
        this.buildComparisonAgent();
    }
    
    style() {
        return `
            .country-title-container {
                text-align: center;
                margin-top: 80px;
                margin-bottom: 40px;
            }

            .country-title {
                font-size: 48px;
                color: #34D399;
            }

            .country-subtitle {
                font-size: 14px;
                opacity: 0.8;
                margin-top: 8px;
                color:  #34D399;
                max-width: 1200px;
                text-align: center;
                line-height: 130%;
                margin: auto;
            }

            .titles {
                text-align: center;
                color:  #34D399;
                margin: 0;
            }
                
            .page-text {
                font-size: 20px;
                color:  #34D399;
            }
                
            .country-agent-container {
                display: flex;
                padding: 40px;
            }

            .containers {
                padding: 20px;
            }

            .country-agents {
                flex: 7;
            }

            .compare-container {
                display: flex;
                flex-direction: column;
                gap: 30px;
                    flex: 2;
            }

            .text-highlight {
                color:  #ccddc7;
                font-weight: bold;
            }
                
            .agent-charts {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 30px;
                width: 100%;
            }

            radar-chart:hover {
                border-radius: 12px;
                box-shadow:
                    0 0 15px  #34D399,
                    inset 0 0 10px #34d39986;
                border: 1px solid  #34D399;
                box-sizing: border-box;
            }
            
            .compare-chart-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 40px;
                padding: 30px;

                border: 1px solid  #34d39986;
                border-radius: 12px;

                box-shadow:
                    0 0 15px  #34d39986,
                    inset 0 0 10px rgba(57,255,20,0.15);
            }

            .compare-agent-chart {
                width: 100%;
                min-height: 200px;
                display: flex;
                justify-content: center;
            }

            .compare-agent-chart {
                margin-top: -40px;
            }
                
            .title-location-agent {
                margin-top: 20px;
                margin-bottom: 20px;
            }
            
            .custom-dropdown {
                position: relative;
                width: 220px;
                user-select: none;
            }

            .dropdown-selected {
                color:  #34D399;
                border: 2px solid  #34D399;
                border-radius: 10px;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                box-shadow:
                    0 0 8px #34d39986,
                    inset 0 0 8px rgba(57,255,20,0.15);
                transition: .2s;
            }

            .dropdown-selected:hover {
                box-shadow:
                    0 0 14px  #34d39986,
                    inset 0 0 12px rgba(57,255,20,0.2);
            }

            .dropdown-options {
                position: absolute;
                top: 110%;
                left: 0;
                width: 100%;
                background: #0D1A2E;
                border: 2px solid  #34D399;
                border-radius: 10px;
                overflow: hidden;
                display: none;
                z-index: 100;
            }

            .dropdown-options.active {
                display: block;
            }

            .dropdown-option {
                padding: 12px 16px;
                color:  #34D399;
                cursor: pointer;
                transition: .15s;
            }

            .dropdown-option:hover {
                background:  #34D399;
                color: #0D1A2E;
            }

            .tooltip {
                position: fixed;
                background: #0D1A2E;
                color:  #34D399;
                border: 1px solid  #34D399;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                pointer-events: none;
                opacity: 0;
                transition: opacity .15s;
                z-index: 9999;
                box-shadow: 0 0 10px rgba(57,255,20,.4);
            }

            .tooltip.visible {
                opacity: 1;
            }    
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${this.style()}</style>
            <div class="country-title-container">
                <h1 class="country-title"></h1>
                <p class="country-subtitle page-text">Here you can view all the agents originating from <span class="text-highlight">this location</span>, and their skill-sets. You can compare this locations agents with the overall best average skill-set agent, either <span class="text-highlight"> across all of the locations</span> or get <span class="text-highlight">one country's</span> best averaging agent.</p>
            </div>

            <div class="tooltip" id="tooltip">
                Higher peaks means stronger skill factor. Click to get a deep dive.
            </div>

            <div class="country-agent-container">
                <div class="country-agents containers">
                    <div class="title-container">
                        <h1 class="titles title-location-agent">All Agents</h1>
                    </div>
                    <div class="agent-charts chart-container"></div>
                </div>

                <div class="compare-container containers">
                
                <div class="compare-chart-container chart-container">
                        <div class="title-container">
                            <h1 class="titles h1">Top Agent</h1>
                        </div>
                        <div class="compare-agent-chart"></div>

                        <div class="custom-dropdown" id="dropdown">
                            <div class="dropdown-selected">ALL LOCATIONS<span>⌄</span></div>
                            <div class="dropdown-options">
                                <div class="dropdown-option" data-value="all">ALL LOCATIONS</div>
                                <div class="dropdown-option" data-value="1">ICELAND</div>
                                <div class="dropdown-option" data-value="2">NORWAY</div>
                                <div class="dropdown-option" data-value="3">DENMARK</div>
                                <div class="dropdown-option" data-value="4">SWEDEN</div>
                                <div class="dropdown-option" data-value="5">FINLAND</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    eListeners() {

        // DROPDOWN
        const options = this.shadowRoot.querySelector(".dropdown-options");
        const selected = this.shadowRoot.querySelector(".dropdown-selected");

        this.shadowRoot.addEventListener("click", (e) => {

            if (e.target.closest(".dropdown-selected")) {
                options.classList.toggle("active");
                return;
            }

            const opt = e.target.closest(".dropdown-option");
            if (opt) {
                this.comparison = opt.dataset.value;
                selected.innerHTML = `${opt.innerText}<span>⌄</span>`;
                options.classList.remove("active");
                this.buildComparisonAgent();
                return;
            }

            options.classList.remove("active");
        });

        // OPEN POPUP
        this.shadowRoot.addEventListener("click", (e) => {
            const radarChart = e.target.closest("radar-chart");
            if (!radarChart) return;

            const popup = document.createElement("agent-deepdive-popup");
            popup.participantId = radarChart.participantId;
            document.body.appendChild(popup);
        });
    }

    updateTitle() {
        const names = {
            1: "Iceland",
            2: "Norway",
            3: "Denmark",
            4: "Sweden",
            5: "Finland"
        };
        this.shadowRoot.querySelector(".country-title").textContent = names[this.location];
    }

    setupTooltip() {
        const tooltip = this.shadowRoot.querySelector("#tooltip");

        this.shadowRoot.addEventListener("mousemove", (e) => {
            if (!tooltip.classList.contains("visible")) return;
            tooltip.style.left = e.clientX + 15 + "px";
            tooltip.style.top = e.clientY + 15 + "px";
        });

        this.shadowRoot.addEventListener("mouseover", (e) => {
            if (e.target.closest("radar-chart")) {
                tooltip.classList.add("visible");
            }
        });

        this.shadowRoot.addEventListener("mouseout", () => {
            tooltip.classList.remove("visible");
        });
    }

    // ALL AGENTS (by location)
    buildCountryCharts() {
        const parent = this.shadowRoot.querySelector(".agent-charts");
        parent.innerHTML = "";
        CService.buildCountriesAgentsCharts(this.location, parent);
    }

    // TOP AGENT (all or by location)
    buildComparisonAgent() {
        const parent = this.shadowRoot.querySelector(".compare-agent-chart");
        parent.innerHTML = "";

        if (this.comparison === "all") {
            CService.buildAvergeSkillChart(null, parent);
            return;
        }

        const topAgent = Agents.getAgentsAverage(Number(this.comparison), null, null, 1);
        CService.buildAvergeSkillChart(topAgent, parent);
    }
}

customElements.define("location-comparison", LocationComparison);

