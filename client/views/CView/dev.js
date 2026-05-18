
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

const topAgentsAllSkills = Agents.getTopAgentsBySkill();
const worstAgentsAllSkills = Agents.getWorstAgentsBySkill();
console.log("TOP AGENTS", topAgentsAllSkills)
// console.log("WORST AGENTS", worstAgentsAllSkills)


// ØREBYTE
const top1 = topAgentsAllSkills[0]
const top1Skills = Agents.getAllSkillFactors(top1["participantId"])
const chartTop1 = document.createElement("radar-chart");
const dataTop1 = {
    axes: [
        { label: skills[0].name, value: top1Skills["Speed"] },
        { label: skills[1].name, value: top1Skills["Accuracy"] },
        { label: skills[2].name, value: top1Skills["Token Power"] },
        { label: skills[3].name, value: top1Skills["Intelligence"] },
        { label: skills[4].name, value: top1Skills["Creativity"] }
    ],
    max: 100,
    min: 0,
    title: top1["name"]
};
chartTop1.data = dataTop1;
chartTop1.heightWidth = hw;

// WULKAINO
const top2 = topAgentsAllSkills[1]
const top2Skills = Agents.getAllSkillFactors(top2["participantId"])
const chartTop2 = document.createElement("radar-chart");
const dataTop2 = {
    axes: [
        { label: skills[0].name, value: top2Skills["Speed"] },
        { label: skills[1].name, value: top2Skills["Accuracy"] },
        { label: skills[2].name, value: top2Skills["Token Power"] },
        { label: skills[3].name, value: top2Skills["Intelligence"] },
        { label: skills[4].name, value: top2Skills["Creativity"] }
    ],
    max: 100,
    min: 0,
    title: top2["name"],
    color: "yellow"
};
chartTop2.data = dataTop2;
chartTop2.heightWidth = hw;

// VIKING
const top3 = topAgentsAllSkills[2]
const top3Skills = Agents.getAllSkillFactors(top3["participantId"])
const chartTop3 = document.createElement("radar-chart");
const dataTop3 = {
    axes: [
        { label: skills[0].name, value: top3Skills["Speed"] },
        { label: skills[1].name, value: top3Skills["Accuracy"] },
        { label: skills[2].name, value: top3Skills["Token Power"] },
        { label: skills[3].name, value: top3Skills["Intelligence"] },
        { label: skills[4].name, value: top3Skills["Creativity"] }
    ],
    max: 100,
    min: 0,
    title: top3["name"],
    color: "cyan"
};
chartTop3.data = dataTop3;
chartTop3.heightWidth = hw;

// BJÖRK
const top4 = topAgentsAllSkills[3]
const top4Skills = Agents.getAllSkillFactors(top4["participantId"])
const chartTop4 = document.createElement("radar-chart");
const dataTop4 = {
    axes: [
        { label: skills[0].name, value: top4Skills["Speed"] },
        { label: skills[1].name, value: top4Skills["Accuracy"] },
        { label: skills[2].name, value: top4Skills["Token Power"] },
        { label: skills[3].name, value: top4Skills["Intelligence"] },
        { label: skills[4].name, value: top4Skills["Creativity"] }
    ],
    max: 100,
    min: 0,
    title: top4["name"],
    color: "coral"
};
chartTop4.data = dataTop4;
chartTop4.heightWidth = hw;

// LAIONAI
const top5 = topAgentsAllSkills[4]
const top5Skills = Agents.getAllSkillFactors(top5["participantId"])
const chartTop5 = document.createElement("radar-chart");
const dataTop5 = {
    axes: [
        { label: skills[0].name, value: top5Skills["Speed"] },
        { label: skills[1].name, value: top5Skills["Accuracy"] },
        { label: skills[2].name, value: top5Skills["Token Power"] },
        { label: skills[3].name, value: top5Skills["Intelligence"] },
        { label: skills[4].name, value: top5Skills["Creativity"] }
    ],
    max: 100,
    min: 0,
    title: top5["name"],
    color: "hotpink"
};
chartTop5.data = dataTop5;
chartTop5.heightWidth = hw;


document.body.appendChild(chartTop1);
document.body.appendChild(chartTop2);
document.body.appendChild(chartTop3);
document.body.appendChild(chartTop4);
document.body.appendChild(chartTop5);






