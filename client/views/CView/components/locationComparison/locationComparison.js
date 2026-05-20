
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

        this.buildCountryCharts();
        this.buildComparisonAgent();
    }

    style() {
        return `
                body {
                    background-color: black;
                }
    
                .country-agent-container {
                    box-sizing: border-box;
                    padding: 20px;
                    width: 100vw;
                    max-height: 100vh;
                    min-height: 1000px;
                    display: flex;
                    gap: 50px;
    
                }
    
                .containers {
                    padding: 5vh;
                }
    
                .country-agents {
                    flex: 7;
                }
    
                .agent-charts {
                    min-height: 100%;
                    min-width: 100%;
                    justify-content: center;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 30px;
                }
    
                .compare-container {
                    flex: 2;
                }
    
                .compare-chart-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 50px;
                    border: 2px solid greenyellow;
                    padding: 20px;
                    border-radius: 10px;
                }
    
                .compare-agent-chart {
                    display: flex;
                    justify-content: center;
                    min-width: 100%;
                    min-height: 200px;
                }
    
    
                .title-container {
                    min-height: 100px;
                }
    
                .titles {
                    text-align: center;
                    font-family: Courier, monospace;
                    color: white;
                }
    
    
    
    
                .custom-dropdown {
                    position: relative;
                    width: 220px;
    
                    font-family: monospace;
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
                        0 0 8px rgba(57, 255, 20, .5),
                        inset 0 0 8px rgba(57, 255, 20, .15);
    
                    transition: .2s;
                }
    
                .dropdown-selected:hover {
                    box-shadow:
                        0 0 14px rgba(57, 255, 20, .8),
                        inset 0 0 12px rgba(57, 255, 20, .2);
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
    
                .custom-dropdown {
                    position: relative;
                    width: 220px;
    
                    font-family: monospace;
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
                        0 0 8px rgba(57, 255, 20, .5),
                        inset 0 0 8px rgba(57, 255, 20, .15);
    
                    transition: .2s;
                }
    
                .dropdown-selected:hover {
                    box-shadow:
                        0 0 14px rgba(57, 255, 20, .8),
                        inset 0 0 12px rgba(57, 255, 20, .2);
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
    
                .dropdown-options {
                    display: none;
                }
    
                .dropdown-options.active {
                    display: block;
                }
            `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${this.style()}</style>

            <div class="country-agent-container">
                <div class="country-agents containers">
                    <div class="title-container">
                        <h1 class="titles">All Agents</h1>
                    </div>
                    <div class="agent-charts chart-container">

                    </div>
                </div>
                <div class="compare-container containers">
                    <div class="title-container">
                        <h1 class="titles h1">Top Agent</h1>
                        <h3 class="titles h3">All Locations</h3>
                    </div>
                    <div class="compare-chart-container chart-container">
                        
                        <div class="compare-agent-chart"> </div>

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
