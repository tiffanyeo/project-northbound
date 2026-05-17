
import { calcSkillFactor } from "./SkillsService.js";

const participants = [
    { id: 272, name: "Aikon" },
    { id: 291, name: "Skai" },
    { id: 205, name: "PølsAI" },
    { id: 71, name: "Preben" },
    { id: 223, name: "AIKEA" },
    { id: 245, name: "AIafjallajökull" },
    { id: 190, name: "Kaitla" },
    { id: 210, name: "Pony" },
    { id: 165, name: "Sauna" },
    { id: 224, name: "Tommy Salo" },
    { id: 124, name: "Hygge" },
    { id: 150, name: "Hytta" },
    { id: 27, name: "Gaiser" },
    { id: 261, name: "Björn" },
    { id: 178, name: "Laionai" },
    { id: 2, name: "NorwAI" },
    { id: 26, name: "StatAI" },
    { id: 11, name: "KirunAI" },
    { id: 18, name: "NokAI" },
    { id: 234, name: "SSAIB" },
    { id: 148, name: "KAI" },
    { id: 121, name: "HurtigAI" },
    { id: 85, name: "SpotifAI" },
    { id: 172, name: "Fjorden" },
    { id: 103, name: "Viking" },
    { id: 25, name: "Grøn" },
    { id: 154, name: "ØreByte" },
    { id: 195, name: "Wulkaino" },
    { id: 135, name: "Björk" },
    { id: 235, name: "LEGO" },
];

const skills = [
    { id: 1, name: "Speed" },
    { id: 2, name: "Accuracy" },
    { id: 3, name: "Token Power" },
    { id: 4, name: "Intelligence" },
    { id: 5, name: "Creativity" },
];

// TOP 5 PER SKILL (all time)
console.log("\n========== TOP 5 PER SKILL (all time) ==========");
for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];

    // calc score for all participants
    const scores = [];
    for (let j = 0; j < participants.length; j++) {
        const parti = participants[j];
        const score = calcSkillFactor(parti.id, skill.id);
        scores.push({ name: parti.name, score });
    }

    // sort highest first
    scores.sort((a, b) => b.score - a.score);

    console.log(`\n  ${skill.name}:`);
    for (let k = 0; k < 5; k++) {
        console.log(`  ${k + 1}. ${scores[k].name} - ${scores[k].score}`);
    }
}

// HEAD TO HEAD
const p1 = { id: 272, name: "Aikon" };
const p2 = { id: 154, name: "ØreByte" };

console.log(`\n========== HEAD TO HEAD: ${p1.name} vs ${p2.name} ==========`);
for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    const score1 = calcSkillFactor(p1.id, skill.id);
    const score2 = calcSkillFactor(p2.id, skill.id);
    const winner = score1 > score2 ? p1.name : score2 > score1 ? p2.name : "draw";
    console.log(`  ${skill.name}: ${p1.name} ${score1} - ${score2} ${p2.name}  (${winner} wins)`);
}

// BOTTOM 5 PER SKILL (all time)
console.log("\n========== BOTTOM 5 PER SKILL (all time) ==========");
for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];

    const scores = [];
    for (let j = 0; j < participants.length; j++) {
        const parti = participants[j];
        const score = calcSkillFactor(parti.id, skill.id);
        scores.push({ name: parti.name, score });
    }

    // sort lowest first
    scores.sort((a, b) => a.score - b.score);

    console.log(`\n  ${skill.name}:`);
    for (let k = 0; k < 5; k++) {
        console.log(`  ${k + 1}. ${scores[k].name} - ${scores[k].score}`);
    }
}


// TOP 5 BEST AVERAGE ACROSS ALL SKILLS
console.log("\n========== TOP 5 BEST AVERAGE ACROSS ALL SKILLS ==========");

const averages = [];
for (let i = 0; i < participants.length; i++) {
    const parti = participants[i];
    let total = 0;

    for (let j = 0; j < skills.length; j++) {
        total += calcSkillFactor(parti.id, skills[j].id);
    }

    const average = Math.round(total / skills.length);
    averages.push({ name: parti.name, id: parti.id, average });
}

// sort highest average first
averages.sort((a, b) => b.average - a.average);

for (let i = 0; i < 5; i++) {
    const parti = averages[i];
    console.log(`\n  ${i + 1}. ${parti.name} (avg: ${parti.average})`);

    // print each skill score
    for (let j = 0; j < skills.length; j++) {
        const skill = skills[j];
        const score = calcSkillFactor(parti.id, skill.id);
        console.log(`     ${skill.name}: ${score}`);
    }
}


// TOP 5 WORST AVERAGE ACROSS ALL SKILLS
console.log("\n========== TOP 5 WORST AVERAGE ACROSS ALL SKILLS ==========");

// sort lowest average first
averages.sort((a, b) => a.average - b.average);

for (let i = 0; i < 5; i++) {
    const parti = averages[i];
    console.log(`\n  ${i + 1}. ${parti.name} (avg: ${parti.average})`);

    for (let j = 0; j < skills.length; j++) {
        const skill = skills[j];
        const score = calcSkillFactor(parti.id, skill.id);
        console.log(`     ${skill.name}: ${score}`);
    }
}