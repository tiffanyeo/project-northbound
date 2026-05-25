import { DB } from "../../../../services/DBAccess.js";
import { CService } from "../../CViewService.js";

export class AgentDeepDive extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.participantId = this.getAttribute("participantId");
    }

    connectedCallback() {
        this.render();
        this.eListeners();

        this.buildSkillSection();
        this.buildBestSkillSection();
        this.buildRankingSection();
    }

    style() {
        return `
            :host {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.92);
                z-index: 9999;
                padding: 100px 0;
                display: flex; 
                justify-content: center;
            }

            .popup {
                width: 90%;
                max-width: 1100px;
                max-height: 90vh;
                overflow-y: auto; /* scroll här istället */
                background:rgba(55, 255, 20, 0.05);;
                border: 1px solid rgba(57,255,20,0.4);
                border-radius: 14px;
                padding: 50px;
                padding-top: 100px;
                box-sizing: border-box;
                color: #adf7a0;
                display: flex;
                flex-direction: column;
                gap: 30px;
                box-shadow:
                    0 0 20px rgba(57,255,20,0.25),
                    inset 0 0 12px rgba(57,255,20,0.15);
            }


            .main-title {
                text-align: center;
                margin: 0;
                font-size: 38px;
                color: #39ff14;
            }
                
            .ranking-value {
                text-align: center;
            }
                
            .section {
                background: #0D1A2E;
                border: 1px solid rgba(57,255,20,0.25);
                border-radius: 12px;
                padding: 30px 40px;
                display: flex;
                flex-direction: column;
                gap: 20px;
                box-shadow:
                    0 0 10px rgba(57,255,20,0.15),
                    inset 0 0 8px rgba(57,255,20,0.1);
            }

            .section h2 {
                margin: 0;
                font-size: 26px;
                color: #39ff14;
                text-align: center;
            }

            .section p {
                max-width: 850px;
                margin: 0 auto;
                font-size: 15px;
                line-height: 150%;
                color: #adf7a0;
                text-align: center;
            }

            .text-highlight {
                color: rgba(57,255,20,0.9);
                font-weight: bold;
            }

            .charts {
                display: flex;
                justify-content: center;
                gap: 30px;
                flex-wrap: wrap;
                margin-top: 10px;
            }

            button.close {
                background: #0D1A2E;
                position: absolute;
                top: 20px;
                right: 20px;
                border: 1px solid #39ff14;
                color: #39ff14;
                padding: 8px 12px;
                cursor: pointer;
                border-radius: 6px;
                transition: 0.2s;
            }

            button.close:hover {
                background: #39ff14;
                color: #0D1A2E;
            }
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>${this.style()}</style>

        <div class="popup">

            <button class="close">X</button>

            <h1 class="main-title">${this.getAgentName()}'s Skills - Deep Dive</h1>

            <div class="section section-3">
            
                <h2>Skill Factor Ranking</h2>

                <h1 class="ranking-value"></h1>
                
                <p>The ranking is calculated from ${this.getAgentName()}'s <span class="text-highlight">average skill factor</span>, compared to all other agents.</p>
                
                <p>This ranking shows the agent's <span class="text-highlight">average skill factor level</span> across all skills and seasons. A lower number means ${this.getAgentName()} has better average skill factors compared to the rest of the agents.</p>

            </div>

            <div class="section section-1">
            
                <h2>Skill Factors</h2>

                <div class="charts all-skills-chart"></div>
                
                <p>Use this chart to understand ${this.getAgentName()}'s <span class="text-highlight">overall strengths and weaknesses</span>
                across every skill factor.</p>

            </div>

            <div class="section section-2">
            
                <h2>Best Skill Ranking</h2>

                <p class="best-skill-name"></p>
                
                <p> This chart helps determine whether ${this.getAgentName()} is a
                <span class="text-highlight">specialist or generalist</span>
                within their top-performing discipline.</p>
                
                <div class="charts best-skill-chart"></div>
                
                <p>This ranking shows how the agent ranks in their <span class="text-highlight">strongest skill area</span>, compared to all other agents skill factor in that skill. A higher placement indicates stronger specialization.</p>
                
                <p class="total-agents"></p>

            </div>

        </div>
    `;
    }


    eListeners() {
        this.shadowRoot.querySelector(".close").addEventListener("click", () => this.remove());
    }

    getAgentName() {
        const found = DB.participants.find(a => a.id === this.participantId);
        return found ? found.name : "Agent";
    }

    buildSkillSection() {
        const parent = this.shadowRoot.querySelector(".all-skills-chart");
        CService.buildAgentAllSkillsChart(this.participantId, parent);
    }

    buildBestSkillSection() {
        const parent = this.shadowRoot.querySelector(".best-skill-chart");
        const nameElem = this.shadowRoot.querySelector(".best-skill-name");
        const totalElem = this.shadowRoot.querySelector(".total-agents");

        CService.buildAgentBestSkillRanking(
            this.participantId,
            parent,
            nameElem,
            totalElem
        );
    }

    buildRankingSection() {
        const parent = this.shadowRoot.querySelector(".ranking-value");
        CService.buildAgentOverallRanking(this.participantId, parent);
    }
}

customElements.define("agent-deepdive-popup", AgentDeepDive);
