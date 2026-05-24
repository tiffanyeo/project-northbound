
import {DB} from "../../services/DBAccess.js"
import { Agents } from "../../services/Agents/Agents.js";


class CViewService {

    buildData(labels, values, meta = {}) {

        const axes = [];
        for (let i = 0; i < labels.length; i++) {
            axes.push({
                label: labels[i],
                value: values[i]
            });
        }

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

    buildRadarChart(data, hw, parent) {
        const radarChart = document.createElement("radar-chart");
        radarChart.data = data;
        radarChart.heightWidth = hw;
        parent.appendChild(radarChart);
    }

    getDefaultRadarChartSize() {
        return {
            hSvg: 250,
            wSvg: 250,
            hPadding: 40,
            wPadding: 40
        };
    }

    buildAgentChart(data) {

        const agentId = data.agent[0].participantId;
        const skills = Agents.getAllSkillFactors(agentId);
        const labels = Object.keys(skills);
        const values = Object.values(skills);

        const meta = {
            title: data.agent[0].name,
            participantId: agentId,
            color: DB.participants.find(a => a.id === agentId).color,
            category: "average-skills"
        };

        const builtData = this.buildData(labels, values, meta);
        this.buildRadarChart(builtData, data.hw, data.parent);
    }

    buildLocationCharts(data) {

        const locationAgents = Agents.getAgentsAverage(data.location.id, null, null, data.limit || 20);

        for (let i = 0; i < locationAgents.length; i++) {

            const agent = locationAgents[i];
            const skills = Agents.getAllSkillFactors(agent.participantId);

            const labels = Object.keys(skills);
            const values = Object.values(skills);

            const meta = {
                title: agent.name,
                participantId: agent.participantId,
                color: DB.participants.find(a => a.id === agent.participantId).color,
                category: "location-average-skills",
                categoryId: data.location.id
            };

            const builtData = this.buildData(labels, values, meta);
            this.buildRadarChart(builtData, data.hw, data.parent);
        }
    }

    createRadarChart(type, data) {

        if (!data.hw) data.hw = this.getDefaultRadarChartSize();

        if (type === "agent") return this.buildAgentChart(data);
        if (type === "location") return this.buildLocationCharts(data);

        console.log("Unknown chart type");
    }

    buildCountriesAgentsCharts(countryId, parent) {
        this.createRadarChart("location", {
            parent,
            location: { id: countryId }
        });
    }

    buildAvergeSkillChart(agent, parent) {
        this.createRadarChart("agent", {
            parent,
            agent: agent || Agents.getAgentsAverage(null, null, null, 1)
        });
    }
}

export const CService = new CViewService();
