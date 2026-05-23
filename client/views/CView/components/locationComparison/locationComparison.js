
import { RadarChart } from "../../../../components/RadarChart.js";
import { Agents } from "../../../../services/Agents/Agents.js";
import { DB } from "../../../../services/DBAccess.js";

import { buildCountriesAgentsCharts } from "../../service.js";
import { buildAvergeSkillChart } from "../../service.js";

/*  
    <location-comparison 
        location="1"
    ></location-comparison>
*/

export class LocationComparison extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.location = this.getAttribute("location");
        this.comparison = "all"
    }

    connectedCallback() {
        this.render();
        this.eListeners();

        this.updateTitle();
        this.setupTooltip();

        this.buildCountryCharts();
        this.buildComparisonAgent();
    }

    style() {
        return `
        :host {
            display: block;
            background: black;
            color: #39ff14;
            font-family: Courier, monospace;
        }

        .country-title-container {
            text-align: center;
            margin-top: 40px;
        }

        .country-title {
            font-size: 48px;
            color: #39ff14;
        }

        .country-subtitle {
            font-size: 14px;
            opacity: 0.8;
            margin-top: 8px;
            color: #39ff14;
            max-width: 1200px;
            text-align: center;
            line-height: 130%;
                        margin: auto;
        }

        .titles {
            text-align: center;
            color: #39ff14;
            margin: 0;
        }
            
        .page-text {
            font-size: 20px;
             color: #adf7a0;
        }
        .country-agent-container {
            display: flex;
            gap: 50px;
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


        .agent-charts {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 30px;
            width: 100%;
        }

        .agent-charts > div,
        .compare-agent-chart > div {
            background: rgba(0,0,0,0.4);
            border: 1px solid rgba(57,255,20,0.6);
            border-radius: 10px;
            padding: 10px;
            cursor: pointer;
            transition: .2s;
            box-shadow:
                0 0 6px rgba(57,255,20,0.25),
                inset 0 0 6px rgba(57,255,20,0.15);
        }

        radar-chart:hover,{
            border-color: #39ff14;
            box-shadow:
                0 0 12px rgba(57,255,20,0.6),
                inset 0 0 10px rgba(57,255,20,0.25);
            transform: translateY(-3px);
            background-color: white;
        }
        
        .compare-chart-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 40px;
            padding: 30px;

            border: 1px solid rgba(57,255,20,0.4)
            border-radius: 12px;

            box-shadow:
                0 0 15px rgba(57,255,20,0.25),
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
        }
        
        .custom-dropdown {
            position: relative;
            width: 220px;
            user-select: none;
        }

        .dropdown-selected {
            background: #050505;
            color: #39ff14;
            border: 2px solid #39ff14;
            border-radius: 10px;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            box-shadow:
                0 0 8px rgba(57,255,20,0.5),
                inset 0 0 8px rgba(57,255,20,0.15);
            transition: .2s;
        }

        .dropdown-selected:hover {
            box-shadow:
                0 0 14px rgba(57,255,20,0.8),
                inset 0 0 12px rgba(57,255,20,0.2);
        }

        .dropdown-options {
            position: absolute;
            top: 110%;
            left: 0;
            width: 100%;
            background: #050505;
            border: 2px solid #39ff14;
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
            color: #39ff14;
            cursor: pointer;
            transition: .15s;
        }

        .dropdown-option:hover {
            background: #39ff14;
            color: black;
        }

        .tooltip {
            position: fixed;
            background: #000;
            color: #39ff14;
            border: 1px solid #39ff14;
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
                <p class="country-subtitle page-text">Here you can view all the agents, that originates from this location, and their skill-sets. You can compare the agents with the agent with the best average skill-set, across all of the locations, or you can choose to compare with one locations best average skill-set agent.</p>
            </div>

            <div class="tooltip" id="tooltip">
                Skill values range from 0–100. Higher means stronger performance.
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
            }

            else if (e.target.closest(".dropdown-option")) {
                const val = e.target.dataset.value;
                this.comparison = val;
                selected.innerHTML = `${e.target.innerText}<span>⌄</span>`;
                options.classList.remove("active");
                this.buildComparisonAgent();
            }

            else {
                options.classList.remove("active");
            }

        });


        // RADAR CHARTS 

        this.shadowRoot.addEventListener("click", (e) => {

            const radarChart = e.target.closest("radar-chart");
            if (radarChart) {
                console.log("participantId:", radarChart.participantId);
                console.log("category:", radarChart.category);
                console.log("categoryId:", radarChart.categoryId);
            }
        })



    }



    updateTitle() {
        const names = {
            1: "Iceland",
            2: "Norway",
            3: "Denmark",
            4: "Sweden",
            5: "Finland"
        };

        const title = this.shadowRoot.querySelector(".country-title");
        title.textContent = names[this.location];
    }

    setupTooltip() {

        const tooltip = this.shadowRoot.querySelector("#tooltip");

        this.shadowRoot.addEventListener("mousemove", (e) => {
            if (!tooltip.classList.contains("visible")) return;
            tooltip.style.left = e.clientX + 15 + "px";
            tooltip.style.top = e.clientY + 15 + "px";
        });

        this.shadowRoot.addEventListener("mouseover", (e) => {
            if (e.target.closest(".agent-charts") || e.target.closest(".compare-agent-chart")) {
                tooltip.classList.add("visible");
            }
        });

        this.shadowRoot.addEventListener("mouseout", (e) => {
            tooltip.classList.remove("visible");
        });
    }

    // ALL AGENTS (by location)
    buildCountryCharts() {
        const agentCharts = this.shadowRoot.querySelector(".agent-charts");
        agentCharts.innerHTML = "";
        buildCountriesAgentsCharts(this.location, agentCharts);
    }

    // COMPARISON AGENT (all or by location)
    buildComparisonAgent() {

        const compareChart = this.shadowRoot.querySelector(".compare-agent-chart");
        compareChart.innerHTML = "";

        // (all locations) top agent
        if (this.comparison == "all") return buildAvergeSkillChart(null, compareChart);

        // (location) top agent
        const locationId = this.comparison === "all" ? null : Number(this.comparison);
        const topAgent = Agents.getAgentsAverage(locationId, null, null, 1);

        buildAvergeSkillChart(topAgent, compareChart);

    }

}

customElements.define("location-comparison", LocationComparison);
