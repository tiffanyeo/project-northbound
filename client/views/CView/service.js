import { RadarChart } from "../../components/RadarChart.js";
import { Agents } from "../../services/Agents/Agents.js";
import { DB } from "../../services/DBAccess.js";


function buildData(labels, values, meta = null) {

    if (labels.length !== values.length) return;

    // build axes
    const axes = []
    for (let i = 0; i < labels.length; i++) {
        const axis = { label: labels[i], value: values[i] }
        axes.push(axis);
    }

    // build data
    let data = {};
    if (!meta) {
        data = {
            axes,
            max: 100,
            min: 0,
        }
        return data;
    }
    data = {
        axes,
        max: meta.max || 100,
        min: meta.min || 0,
        title: meta.title || null,
        color: meta.color || null,
    }
    return data;
}

function buildRadarChart(data, hw, parent) {
    const radarChart = document.createElement("radar-chart");
    radarChart.data = data;
    radarChart.heightWidth = hw;
    parent.appendChild(radarChart);
}


function createRadarChart(type, data) {

    // constraints
    if (data.parent == null) return console.log("parent required");
    if (!data.hw) data.hw = { hSvg: 300, wSvg: 300, hPadding: 60, wPadding: 60 };

    switch (type) {

        case "agent":

            // constraints
            if (data.agent.participantId == null) return console.log("agent required");

            // all skills (average)
            const agentAverage = Agents.getAllSkillFactors(data.agent.participantId)
            const meta = {
                min: 0,
                max: 100,
                color: data.color || null,
                title: data.agent.name,
            }
            const labels = agentAverage.map(datum => datum[0])
            const values = agentAverage.map(datum => datum[1])

            // build chart
            const builtData = buildData(labels, values, meta)
            buildRadarChart(builtData, data.hw, data.parent)

            break;


        // data.location, data.parent
        case "location":

            // constraints
            if (data.location.id == null) return console.log("location required");
            if (!data.limit) data.limit = 20;

            // { participantId: 154, name: "ØreByte", skillFactor: 70 }
            const locationAgents = Agents.getAgentsAverage(data.location.id, null, null, data.limit);

            // { agent: {pId: int, name: "", skillFactor: int}, skills: {speed: int, accuracy: int} }
            const locAgentsSkills = [];
            for (const currAgent of locationAgents) {
                const agentsSkills = Agents.getAllSkillFactors(currAgent.participantId);
                locAgentsSkills.push({ agent: currAgent, skills: agentsSkills });
            }

            // build for every agent:
            for (let i = 0; i < locAgentsSkills.length; i++) {

                const labels = Object.keys(locAgentsSkills[i].skills);
                const values = Object.values(locAgentsSkills[i].skills);
                const color = DB.participants.find(currA => currA.id === locAgentsSkills[i].agent.participantId).color;

                const meta = {
                    min: 0,
                    max: 100,
                    color: data.color || color,
                    title: locAgentsSkills[i].agent.name || "No name?",
                }

                // build chart
                const builtData = buildData(labels, values, meta);
                buildRadarChart(builtData, data.hw, data.parent);

            }
            break;

        default:
            return console.log("No building type found.");
    }


}


export function buildCountriesAgents(countryId, parent = null) {
    const dataObj = { parent: parent || document.querySelector("body"), location: { id: countryId } };
    createRadarChart("location", dataObj)
}