import { DB } from "./DBAccess.js"
/* 
    calculateSkill(participantId, skillId) == 49 (skillFactor - all time)
    calculateSkill(participantId, skillId, seasonYear) == 78 (skillFactor - that season)
*/
export function calcSkillFactor(participantId, skillId, seasonYear = null) {

    // SKILL-FACTOR RANGE (1-100)
    const minSkillFactor = 1;
    const maxSkillFactor = 100;

    // FIND SKILL
    const skill = DB.skills.find(s => s.id === skillId);
    if (!skill) return `Skill with id ${skillId} not found`;
    const skillName = skill.name;

    // FILTER SEASONS
    const seasons = [];
    for (let i = 0; i < DB.seasons.length; i++) {
        if (seasonYear === null || DB.seasons[i].year === seasonYear) {
            // add one season, or all
            seasons.push(DB.seasons[i]);
        }
    }

    // CALC TOTAL SCORES PER DISC. AND PARTIC. (per seeason)
    const scoresByPartiAndDisci = {}; // { pId: { dId: score, dId: score} }
    
    // loop seasons [i]
    for (let i = 0; i < seasons.length; i++) {
        const currSeason = seasons[i];

        // loop comp. days (in currSeason) [j]
        for (let j = 0; j < currSeason.competitionDays.length; j++) {
            const currDay = currSeason.competitionDays[j];

            // loop events (in comp.day) [k]
            for (let k = 0; k < currDay.events.length; k++) {
                const currEvent = currDay.events[k];

                // loop scores (in event) [l]
                for (let l = 0; l < currEvent.scores.length; l++) {
                    const currPartiId = currEvent.scores[l].participantId; // what partic.
                    const currScore = currEvent.scores[l].score; // how many points
                    const currDiscId = currEvent.disciplineId; // what disci.

                    // update scores
                    if (!scoresByPartiAndDisci[currPartiId]) {
                        scoresByPartiAndDisci[currPartiId] = {};
                    }
                    if (!scoresByPartiAndDisci[currPartiId][currDiscId]) {
                        scoresByPartiAndDisci[currPartiId][currDiscId] = 0;
                    }
                    scoresByPartiAndDisci[currPartiId][currDiscId] += currScore;
                }
            }
        }
    }

    // CALC INTERMEDIATE VALUE (tot. discipline score * skill weight)
    const averagesInDiscipline = {}; // { pId: averageValue }

    // loop partic. [i]
    for (let i = 0; i < DB.participants.length; i++) {
        
        const currPartiId = DB.participants[i].id;
        const currPartiDisciScores = scoresByPartiAndDisci[currPartiId] || {};
        let total = 0;

        // loop disc. [j]
        for (let j = 0; j < DB.disciplines.length; j++) {
            
            const currDiscipline = DB.disciplines[j];
            const partiTotScoreDisci = currPartiDisciScores[currDiscipline.id] || 0; 
            const totSkillWeightDisci = currDiscipline.skillFactors[skillName] || 0;
            
            total += partiTotScoreDisci * totSkillWeightDisci; // pId dId skillValue
            
        }

        averagesInDiscipline[currPartiId] = total;
    }

    // FIND MIN/MAX AVERAGES IN SKILL
    let globalMin = null;
    let globalMax = null;

    for (const currDiscId in averagesInDiscipline) {
        const currValue = averagesInDiscipline[currDiscId];
        if (globalMin === null || currValue < globalMin) globalMin = currValue;
        if (globalMax === null || currValue > globalMax) globalMax = currValue;
    }

    const partiAvrDisci = averagesInDiscipline[participantId];
    if (partiAvrDisci === undefined) return `Participant: ${participantId} not found`;

    // CALC SCORE
    if (globalMax === globalMin) return minSkillFactor;
    return ((partiAvrDisci - globalMin) / (globalMax - globalMin)) * (maxSkillFactor - minSkillFactor) + minSkillFactor;

}