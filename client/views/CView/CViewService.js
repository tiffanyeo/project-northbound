
import { RadarChart } from "../../components/RadarChart.js";
import { Agents } from "../../services/Agents/Agents.js";
import { DB } from "../../services/DBAccess.js";


class CViewService {

    buildData(labels, values, meta = null) {

        if (labels.length !== values.length) return;

        // build axes
        const axes = [];
        for (let i = 0; i < labels.length; i++) {
            const axis = {
                label: labels[i],
                value: values[i]
            };

            axes.push(axis);
        }

        // build data
        let data = {};

        if (!meta) {
            data = {
                axes,
                max: 100,
                min: 0,
            };

            return data;
        }

        data = {
            axes,
            max: meta.max || 100,
            min: meta.min || 0,
            title: meta.title || null,
            color: meta.color || null,
            participantId: meta.participantId || null,
            category: meta.category || null,
            categoryId: meta.categoryId || null,
        };

        return data;
    }


    // -- RADAR CHART SERVICE --
    
    buildRadarChart(data, hw, parent) {

        const radarChart = document.createElement("radar-chart");

        radarChart.data = data;
        radarChart.heightWidth = hw;

        // tänk på detta:
        // radar-chart kräver att data och heightWidth
        // sätts innan appendChild()
        parent.appendChild(radarChart);
    }


    getDefaultRadarChartSize() {
        return {
            hSvg: 280,
            wSvg: 280,
            hPadding: 60,
            wPadding: 60
        };
    }


    buildAgentMeta(data, color = null) {

        return {
            min: 0,
            max: 100,
            color: data.color || color || null,
            title: data.agent[0].name,
            participantId: data.agent[0].participantId,
            category: "average-skills",
            categoryId: null,
        };
    }


    buildLocationMeta(data, locationAgent, color = null) {

        return {
            min: 0,
            max: 100,
            color: data.color || color,
            title: locationAgent.agent.name || "No name?",
            participantId: locationAgent.agent.participantId,
            category: "location-average-skills",
            categoryId: data.location.id,
        };
    }


    buildAgentChart(data) {

        // constraints
        if (!data.agent) {
            data.agent = Agents.getAgentsAverage(null, null, null, 1);
        }

        // all skills (average)
        const agentAverage = Agents.getAllSkillFactors(data.agent[0].participantId);

        const color = DB.participants.find(
            currA => currA.id === data.agent[0].participantId
        ).color;

        const labels = Object.keys(agentAverage);
        const values = Object.values(agentAverage);

        const meta = this.buildAgentMeta(data, color);

        // build chart
        const builtData = this.buildData(labels, values, meta);

        this.buildRadarChart(
            builtData,
            data.hw,
            data.parent
        );
    }

    buildLocationCharts(data) {

        // constraints
        if (data.location.id == null) {
            return console.log("location required");
        }

        if (!data.limit) {
            data.limit = 20;
        }

        // { participantId: 154, name: "ØreByte", skillFactor: 70 }
        const locationAgents = Agents.getAgentsAverage(
            data.location.id,
            null,
            null,
            data.limit
        );

        // { agent: {pId: int, name: "", skillFactor: int}, skills: {speed: int, accuracy: int} }
        const locAgentsSkills = [];

        for (const currAgent of locationAgents) {

            const agentsSkills = Agents.getAllSkillFactors(currAgent.participantId);

            locAgentsSkills.push({
                agent: currAgent,
                skills: agentsSkills
            });
        }


        // build for every agent:
        for (let i = 0; i < locAgentsSkills.length; i++) {

            const labels = Object.keys(locAgentsSkills[i].skills);
            const values = Object.values(locAgentsSkills[i].skills);

            const color = DB.participants.find(
                currA => currA.id === locAgentsSkills[i].agent.participantId
            ).color;

            const meta = this.buildLocationMeta(
                data,
                locAgentsSkills[i],
                color
            );

            // build chart
            const builtData = this.buildData(labels, values, meta);

            this.buildRadarChart(
                builtData,
                data.hw,
                data.parent
            );
        }
    }


    createRadarChart(type, data) {

        // constraints
        if (data.parent == null) {
            return console.log("parent required");
        }

        if (!data.hw) {
            data.hw = this.getDefaultRadarChartSize();
        }


        switch (type) {

            case "agent":
                this.buildAgentChart(data);
                break;


            // data.location, data.parent
            case "location":
                this.buildLocationCharts(data);
                break;


            default:
                return console.log("No building type found.");
        }
    }


    // ALL AGENTS (by country)
    buildCountriesAgentsCharts(countryId, parent = null) {

        const dataObj = {
            parent: parent || document.querySelector("body"),
            location: { id: countryId }
        };

        this.createRadarChart("location", dataObj);
    }


    // ONE AGENT (average skills)
    buildAvergeSkillChart(participant = null, parent = null) {

        const dataObj = {
            parent: parent || document.querySelector("body"),
            agent: participant
        };

        this.createRadarChart("agent", dataObj);
    }


    // -- BAR CHART SERVICE --

    buildBarChartData(arr) {

        const data = [];

        for (let i = 0; i < arr.length; i++) {

            data.push({
                label: `${i + 1}. ${arr[i].name}`,
                value: arr[i].skillFactor
            });
        }

        return {
            bars: data,
            min: 0,
            max: 100
        };
    }

    createBarChart(chartData, parent) {

        // MAKE MODULAR LATER! ***
        const hw = {
            hSvg: 500,
            wSvg: 600,
            hPadding: 50,
            wPadding: 100,
        };

        const barChart = document.createElement("bar-chart");
        barChart.hw = hw;
        barChart.data = chartData;
        parent.appendChild(barChart);
    }

    getAgentsPlacementByBestSkill(agent) {

        const agentBestSkillFactor = Agents.getBestSkill(agent.id);

        const bestSkill = DB["skills"].find(
            currS => currS.name == agentBestSkillFactor.skillName
        );

        const allAgentsSkillFactor = [];

        for (let currAgent of DB["participants"]) {

            const currBest = Agents.getSkillFactor(
                currAgent.id,
                bestSkill.id
            );

            allAgentsSkillFactor.push({
                name: currAgent.name,
                id: currAgent.id,
                skillFactor: currBest,
                skill: bestSkill.name
            });
        }

        // sort
        allAgentsSkillFactor.sort(
            (a, b) => b.skillFactor - a.skillFactor
        );

        /* { name: "Björk", id: 135, skillFactor: 100, … } */
        let showPlacement;

        for (let i = 0; i < allAgentsSkillFactor.length; i++) {

            if (allAgentsSkillFactor[i].id === agent.id) {

                // in top 10, show at least 10
                if (i < 10) {

                    showPlacement = allAgentsSkillFactor.splice(0, 10);

                } else {

                    // else show placement
                    showPlacement = allAgentsSkillFactor.splice(0, i + 2);
                }
            }
        }

        return {
            bestSkill,
            placement: showPlacement
        };
    }


}


export const CService = new CViewService();


// ALL AGENTS (by country)
export function buildCountriesAgentsCharts(countryId, parent = null) {
    CService.buildCountriesAgentsCharts(countryId, parent);
}


// ONE AGENT (average skills)
export function buildAvergeSkillChart(participant = null, parent = null) {
    CService.buildAvergeSkillChart(participant, parent);
}
