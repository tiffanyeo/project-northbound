
import { DB } from "../../services/DBAccess.js"
import { Agents } from "../../services/Agents/Agents.js";


class CViewService {

    buildRadarData(labels, values, meta = {}) {
        // build axes array
        const axes = [];
        for (let i = 0; i < labels.length; i++) {
            axes.push({
                label: labels[i],
                value: values[i]
            });
        }
        // return full data object
        return {
            axes,
            max: meta.max || 100,
            min: meta.min || 0,
            title: meta.title || null,
            color: meta.color || null,
            participantId: meta.participantId || null,
            category: meta.category || null,
            categoryId: meta.categoryId || null
        };
    }

    // --- LOCATTION COMPARISON SERVICES ---

    // CREATE RADAR CHART ELEMENT
    buildRadarChart(data, hw, parent) {
        const radarChart = document.createElement("radar-chart");
        radarChart.data = data;
        radarChart.heightWidth = hw;
        parent.appendChild(radarChart);
    }

    // DEFAULT RADAR SIZE
    getDefaultRadarChartSize() {
        return {
            hSvg: 230,
            wSvg: 260,
            hPadding: 40,
            wPadding: 60
        };
    }

    // BUILD RADAR FOR ONE AGENT (AVERAGE SKILLS)
    buildAgentChart(data) {

        // agent data
        const agentId = data.agent[0].participantId;
        const skills = Agents.getAllSkillFactors(agentId);

        // labels + values
        const labels = Object.keys(skills);
        const values = Object.values(skills);

        // meta info
        const meta = {
            title: data.agent[0].name,
            participantId: agentId,
            color: DB.participants.find(a => a.id === agentId).color,
            category: "average-skills"
        };

        // build data + chart
        const builtData = this.buildRadarData(labels, values, meta);
        this.buildRadarChart(builtData, data.hw, data.parent);
    }

    // BUILD RADAR FOR ALL AGENTS IN LOCATION
    buildLocationCharts(data) {

        // get top agents in location
        const locationAgents = Agents.getAgentsAverage(data.location.id, null, null, data.limit || 20);

        for (let i = 0; i < locationAgents.length; i++) {

            // get skills
            const agent = locationAgents[i];
            const skills = Agents.getAllSkillFactors(agent.participantId);

            // labels + values
            const labels = Object.keys(skills);
            const values = Object.values(skills);

            // meta info
            const meta = {
                title: agent.name,
                participantId: agent.participantId,
                color: DB.participants.find(a => a.id === agent.participantId).color,
                category: "location-average-skills",
                categoryId: data.location.id
            };

            // build data + chart
            const builtData = this.buildRadarData(labels, values, meta);
            this.buildRadarChart(builtData, data.hw, data.parent);
        }
    }

    // ROUTER FOR RADAR CHART TYPES
    createRadarChart(type, data) {
        // constraints
        if (!data.hw) data.hw = this.getDefaultRadarChartSize();

        if (type === "agent") return this.buildAgentChart(data);
        if (type === "location") return this.buildLocationCharts(data);

    }

    // BUILD ALL AGENTS IN COUNTRY
    buildCountriesAgentsCharts(countryId, parent) {
        this.createRadarChart("location", {
            parent,
            location: { id: countryId },
            hw: this.getDefaultRadarChartSize()
        });
    }

    // BUILD ONE AGENT (AVERAGE SKILLS)
    buildAvergeSkillChart(agent, parent) {
        this.createRadarChart("agent", {
            parent,
            agent: agent || Agents.getAgentsAverage(null, null, null, 1)
        });
    }

    // --- DEEPDIVE SERVICES ---
    // BUILD BAR CHART (all skills for one agent)
    buildAgentAllSkillsChart(participantId, parent) {

        // get all skills
        const allSkills = Agents.getAllSkillFactors(participantId);
        const agent = DB.participants.find(currAgent => currAgent.id == participantId)

        // labels + values
        const labels = Object.keys(allSkills);
        const values = Object.values(allSkills);

        // build bars
        const bars = [];
        for (let i = 0; i < labels.length; i++) {
            bars.push({
                label: labels[i],
                value: values[i]
            });
        }

        // chart data
        const chartData = {
            bars,
            min: 0,
            max: 100,
            markedBar: agent.name,
            color: agent.color
        };

        // create bar chart
        const barChart = document.createElement("bar-chart");
        barChart.hw = {
            hSvg: 300,
            wSvg: 700,
            hPadding: 40,
            wPadding: 80
        };
        barChart.sideways = false;
        barChart.data = chartData;
        parent.appendChild(barChart);

    }

    // BUILD BAR CHART (best skill ranking)
    buildAgentBestSkillRanking(participantId, parent, nameElem, totalElem) {

        // get agent best skill
        const agentBest = Agents.getBestSkill(participantId);
        const bestSkill = DB.skills.find(s => s.name === agentBest.skillName);

        // collect all agents skillfactor for this skill
        const allAgentsSkillFactor = [];
        for (let currAgent of DB.participants) {
            const currBest = Agents.getSkillFactor(currAgent.id, bestSkill.id);
            allAgentsSkillFactor.push({
                name: currAgent.name,
                id: currAgent.id,
                skillFactor: currBest
            });
        }

        // assign rank numbers
        allAgentsSkillFactor.sort((a, b) => b.skillFactor - a.skillFactor);
        for (let i = 0; i < allAgentsSkillFactor.length; i++) {
            allAgentsSkillFactor[i].rank = i + 1;
        }

        // find agent index
        let agentIndex = 0;
        for (let i = 0; i < allAgentsSkillFactor.length; i++) {
            if (allAgentsSkillFactor[i].id == participantId) {
                agentIndex = i;
                break;
            }
        }

        // window of 10 agents
        const windowSize = 10;
        let startIndex = agentIndex - 5;

        if (agentIndex < 5) startIndex = 0;
        if (agentIndex > allAgentsSkillFactor.length - 6) {
            startIndex = allAgentsSkillFactor.length - windowSize;
            if (startIndex < 0) startIndex = 0;
        }

        // slice window
        let endIndex = startIndex + windowSize;
        if (endIndex > allAgentsSkillFactor.length) endIndex = allAgentsSkillFactor.length;
        const showPlacement = allAgentsSkillFactor.slice(startIndex, endIndex);
        const agent = DB.participants.find(currAgent => currAgent.id == participantId)

        // build data
        const bars = [];
        for (let i = 0; i < showPlacement.length; i++) {
            bars.push({
                label: `${showPlacement[i].rank}. ${showPlacement[i].name}`,
                value: showPlacement[i].skillFactor
            });
        }
        const chartData = {
            bars,
            min: 0,
            max: 100,
            markedBar: agent.name,
            color: agent.color
        };

        // create bar chart
        const barChart = document.createElement("bar-chart");
        barChart.hw = {
            hSvg: 450,
            wSvg: 700,
            hPadding: 50,
            wPadding: 120
        };
        barChart.sideways = true;
        barChart.data = chartData;
        parent.appendChild(barChart);

        // update text
        nameElem.textContent = `Ranking based on ${bestSkill.name}`;
        totalElem.textContent = `Showing 10 out of ${allAgentsSkillFactor.length} agents`;
    }

    // BUILD OVERALL RANKING (average skill)
    buildAgentOverallRanking(participantId, parentElem) {
        // get all agents sorted
        const all = Agents.getAgentsAverage(null, null, null, 100);
        // find index
        let index = 0;
        for (let i = 0; i < all.length; i++) {
            if (all[i].participantId === participantId) {
                index = i;
                break;
            }
        }
        // update text
        parentElem.textContent = `Placement: #${index + 1}`;
    }


}

export const CService = new CViewService();
