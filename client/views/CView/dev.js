
import { RadarChart } from "../../components/RadarChart.js";
import { Agents } from "../../services/Agents/Agents.js";
import { DB } from "../../services/DBAccess.js";

const skills = DB["skills"];
console.log("SKILLS", skills)

const disciplines = DB["disciplines"]
console.log("DISCIPLINES", disciplines)

const topAgentSkills = Agents.getAllSkillFactors(154)
/* console.log("TOP AGENTS SKILLS", topAgentSkills)

console.log(topAgentSkills["Speed"])
console.log(skills[0]) */


const hw = { hSvg: 300, wSvg: 300, hPadding: 60, wPadding: 60 };
const data = {
    axes: [
        { label: skills[0].name, value: topAgentSkills["Speed"] },
        { label: skills[1].name, value: topAgentSkills["Accuracy"] },
        { label: skills[2].name, value: topAgentSkills["Token Power"] },
        { label: skills[3].name, value: topAgentSkills["Intelligence"] },
        { label: skills[4].name, value: topAgentSkills["Creativity"] }
    ],
    max: 100,
    min: 0,
    color: "hotpink"
};


const topAgentsAllSkills = Agents.getTopAgentsBySkill();
const worstAgentsAllSkills = Agents.getWorstAgentsBySkill();
/* console.log("TOP AGENTS", topAgentsAllSkills)
console.log("WORST AGENTS", worstAgentsAllSkills)
 */



const chart = document.createElement("radar-chart");
chart.heightWidth = hw;
chart.data = data;

document.body.appendChild(chart); 
