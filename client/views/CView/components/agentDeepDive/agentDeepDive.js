import { Agents } from "../../../../services/Agents/Agents.js";
import { DB } from "../../../../services/DBAccess.js";

import { CService } from "../../CViewService.js";
// import { buildAvergeSkillChart } from "../../CViewService.js";
// import { buildCountriesAgentsCharts } from "../../CViewService.js";

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
        // close popup
        const closeBTN = this.shadowRoot.querySelector(".close");
        closeBTN.addEventListener("click", () => this.remove());
    }

    getAgentName() {
        // get agent name
        const foundAgent = DB.participants.find(currAgent => currAgent.id === this.participantId);
        return foundAgent ? foundAgent.name : "Agent";
    }

    // build all skills chart (section 1)
    buildSkillSection() {

        // get all skill factors
        const allSkills = Agents.getAllSkillFactors(this.participantId);

        // convert data to bar chart format
        const bars = [];
        const labels = Object.keys(allSkills);
        const values = Object.values(allSkills);
        for (let i = 0; i < labels.length; i++) {
            bars.push({
                label: labels[i],
                value: values[i]
            });
        }
        const chartData = {
            bars,
            min: 0,
            max: 100
        };

        // create chart
        const barChart = document.createElement("bar-chart");
        barChart.hw = {
            hSvg: 300,
            wSvg: 700,
            hPadding: 40,
            wPadding: 80
        };
        barChart.sideways = false;
        barChart.data = chartData;

        // append chart
        const chartParent = this.shadowRoot.querySelector(".all-skills-chart");
        chartParent.appendChild(barChart);
    }

    // build best skill ranking (section 1)
    buildBestSkillSection() {

        // get agent best skill
        const agentBest = Agents.getBestSkill(this.participantId);
        const bestSkill = DB.skills.find(currSkill => currSkill.name === agentBest.skillName);

        // get (all) agents skillfactors for this skill
        const allAgentsSkillFactor = [];
        for (let currAgent of DB.participants) {
            // this skill
            const currBest = Agents.getSkillFactor(currAgent.id, bestSkill.id);
            allAgentsSkillFactor.push({
                name: currAgent.name,
                id: currAgent.id,
                skillFactor: currBest,
                skill: bestSkill.name
            });
        }

        // sort and save ranking
        allAgentsSkillFactor.sort((a, b) => b.skillFactor - a.skillFactor);
        for (let i = 0; i < allAgentsSkillFactor.length; i++) {
            allAgentsSkillFactor[i].rank = i + 1;
        }

        // show 10 agents
        const totalAgentsLength = allAgentsSkillFactor.length;

        // find agent index
        let agentIndex = 0;
        for (let i = 0; i < totalAgentsLength; i++) {
            if (allAgentsSkillFactor[i].id == this.participantId) {
                agentIndex = i;
                break;
            }
        }

        // always show 10 agents
        const windowSize = 10;

        // default start
        let startIndex = agentIndex - 5;

        // if agent is in top 10
        if (agentIndex < 5) startIndex = 0;

        // if agent is near the end
        if (agentIndex > totalAgentsLength - 6) {
            startIndex = totalAgentsLength - windowSize;
            if (startIndex < 0) startIndex = 0;
        }

        let endIndex = startIndex + windowSize;
        if (endIndex > totalAgentsLength) endIndex = totalAgentsLength;

        // create data for chart
        const showPlacement = allAgentsSkillFactor.slice(startIndex, endIndex);
        const bars = [];
        for (let i = 0; i < showPlacement.length; i++) {
            const currPlacement = showPlacement[i];
            bars.push({
                label: `${currPlacement.rank}. ${currPlacement.name}`,
                value: currPlacement.skillFactor
            });
        }
        const chartData = {
            bars,
            min: 0,
            max: 100
        };

        // create chart
        const barChart = document.createElement("bar-chart");
        barChart.hw = {
            hSvg: 450,
            wSvg: 700,
            hPadding: 50,
            wPadding: 120
        };
        barChart.data = chartData;
        barChart.sideways = true;
        const parentElem = this.shadowRoot.querySelector(".best-skill-chart");
        parentElem.appendChild(barChart);

        // add support text
        const skillNameText = this.shadowRoot.querySelector(".best-skill-name");
        skillNameText.innerHTML = `Ranking based on <span class="text-highlight">${bestSkill.name}</span>.`;
        const totalAgents = allAgentsSkillFactor.length;
        const totalText = this.shadowRoot.querySelector(".total-agents");
        totalText.innerHTML = `Showing a 10 agent-snippet out of <span class="text-highlight">${totalAgents} total agents </span> in decending order.`;

    }

    // build overall ranking (section 1)
    buildRankingSection() {

        // get all agents sorted
        const all = Agents.getAgentsAverage(null, null, null, 100);
        const index = all.findIndex(a => a.participantId === this.participantId);

        // show rank
        const rankingText = this.shadowRoot.querySelector(".ranking-value");
        rankingText.textContent = `Placement: #${index + 1}`;

    }

}

customElements.define("agent-deepdive-popup", AgentDeepDive);
