
import "../../../../components/RadarChart.js";
import "../../../../components/BarChart.js";

import { DB } from "../../../../services/DBAccess.js";
import { CService } from "../../CViewService.js";
import { Agents } from "../../../../services/Agents/Agents.js";


/*

    const popup = document.createElement("agent-deepdive-popup");
    popup.participantId = 192;
    document.body.appendChild(popup);

*/


class AgentDeepDivePopup extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.participantId = null;
    }


    connectedCallback() {

        this.render();
        this.eListeners();

        this.buildAllCharts();
        this.updateAgentData();

    }


    style() {
        return `

            :host {
                position: fixed;
                inset: 0;
                z-index: 99999;

                display: flex;
                justify-content: center;
                align-items: center;

                background: rgba(0,0,0,0.75);
                backdrop-filter: blur(4px);
            }

            .agent-popup-container {
                width: 100%;
                max-width: 1400px;
                max-height: 90vh;

                overflow-y: auto;

                background: black;
                color: #39ff14;

                border-radius: 15px;
                padding: 50px;

                box-shadow:
                    0 0 25px rgba(55, 255, 20, 0.631),
                    inset 0 0 10px rgba(57, 255, 20, 0.15);
            }

            .agent-popup-content-container {
                display: flex;
                flex-direction: column;
                gap: 50px;
            }

            section {
                border-radius: 15px;
                padding: 20px;

                border: 1px solid rgba(57,255,20,0.3);

                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .info-text {
                font-size: 18px;
                line-height: 130%;
            }

            .charts {
                margin: auto;
            }

            .text-highlight {
                color: rgba(57, 255, 20, 0.8);
                font-weight: bold;
            }

            .close-btn {
                cursor: pointer;

                background: transparent;
                color: #39ff14;

                border: 1px solid #39ff14;
                border-radius: 8px;

                padding: 10px 14px;

                font-family: monospace;
            }

            .close-btn:hover {
                background: #39ff14;
                color: black;
            }

        `;
    }


    render() {

        // constraint
        if (!this.participantId) return console.log("participantId required");

        this.shadowRoot.innerHTML = `

            <style>${this.style()}</style>

            <div class="agent-popup-container">

                <div class="agent-popup-content-container">

                    <button class="close-btn">CLOSE</button>

                    <h1>Skill Deep Dive</h1>

                    <section class="section-1">

                        <div class="title-info-container">
                            <h1 class="agent-name"></h1>

                            <p class="agent-info info-text">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </p>
                        </div>

                        <div class="skill-factor-container">

                            <h2 class="title-h2">Skill factors</h2>

                            <div class="charts all-skills-chart"></div>

                            <p class="agent-info info-text">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </p>

                        </div>

                    </section>


                    <section class="section-2">

                        <div class="best-skill-container container">

                            <h2 class="title-h2">
                                Ranking In Best Skill Factor
                            </h2>

                            <div class="charts best-skill-chart"></div>

                            <p class="info-text best-skill-text"></p>

                        </div>

                    </section>


                    <section class="section-3">

                        <div class="ranking-container container">

                            <h2 class="title-h2">
                                Ranking Across All Skills
                            </h2>

                            <h3 class="ranking-text"></h3>

                        </div>

                        <p class="info-text">Ranking all time</p>

                    </section>

                </div>

            </div>

        `;
    }


    eListeners() {

        const closeBtn = this.shadowRoot.querySelector(".close-btn");

        closeBtn.addEventListener("click", () => {
            this.remove();
        });

    }


    getAgent() {
        const foundAgent = DB.participants.find(
            currAgent => currAgent.id == this.participantId
        );
        return foundAgent;
    }


    updateAgentData() {

        const agent = this.getAgent();
        const agentName = this.shadowRoot.querySelector(".agent-name");
        agentName.textContent = agent.name;

        // ALL SKILLS RANKING
        const rankingText = this.shadowRoot.querySelector(".ranking-text");
        const allAgents = Agents.getAgentsAverage(null, null, null, DB.participants.length);

        let ranking;
        for (let i = 0; i < allAgents.length; i++) {
            if (allAgents[i].participantId == this.participantId) {
                ranking = i + 1;
            }
        }
        rankingText.textContent = ranking;


        // BEST SKILL TEXT
        const placementData = CService.getAgentsPlacementByBestSkill(agent);
        const bestSkillText = this.shadowRoot.querySelector(".best-skill-text");
        bestSkillText.textContent = `
            ${agent.name}'s strongest skill is ${placementData.bestSkill.name}.
        `;
        
    }


    buildAllCharts() {
        this.buildSkillFactorChart();
        this.buildBestSkillChart();
    }


    buildSkillFactorChart() {

        // get data
        const parentAllSkillsChart = this.shadowRoot.querySelector(".all-skills-chart");
        const participant = [{
            participantId: this.participantId,
            name: this.getAgent().name
        }];
        
        // build ave. radar chart
        CService.buildAvergeSkillChart(
            participant,
            parentAllSkillsChart
        );
        
    }


    buildBestSkillChart() {

        // get data
        const parentBestSkillChart = this.shadowRoot.querySelector(".best-skill-chart");
        const placementData = CService.getAgentsPlacementByBestSkill(this.getAgent());
        const chartData = CService.buildBarChartData(placementData.placement);

        // build skill bar-chart
        CService.createBarChart(chartData, parentBestSkillChart);
        
    }

}


customElements.define("agent-deepdive-popup", AgentDeepDivePopup);
