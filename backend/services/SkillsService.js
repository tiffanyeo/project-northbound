import { DB } from "./DBAccess.js"

/* 
    calcSkillFactor(participantId, skillId) == skillFactor (all time)
    calcSkillFactor(participantId, skillId, seasonYear) == skillFactor (that season)
*/
export function calcSkillFactor(participantId, skillId, seasonYear = null) {

    // SKILL-FACTOR RANGE (1-100)
    const minSkillFactor = 1;
    const maxSkillFactor = 100;

    // FIND SKILL
    const skillName = findSkillName(skillId);

    // FIND SEASON(S)
    const seasons = filterSeasons(seasonYear);

    // CALC TOTAL EARNED SCORES PER DISC. AND PARTIC.
    const scoresByPartiInDisci = calcScoresByPartiAndDisci(seasons);

    // CALC INTERMEDIATE VALUE (parti. weighted tot. disci. scores)
    const sFactorWeightedScores = calcWeightedScoresInDisci(scoresByPartiInDisci, skillName);

    // FIND MIN/MAX (weighted skill scores)
    const minMax = findMinMaxSkillScores(sFactorWeightedScores);
    const globalMin = minMax.globalMin;
    const globalMax = minMax.globalMax;

    // GET PARTI. WEIGHTED SKILL SCORE
    const partiWeightedSkillScore = sFactorWeightedScores[participantId];
    if (partiWeightedSkillScore === undefined) return `Participant: ${participantId} not found`;

    // NORMALIZE VALUE
    const normalized = normalize(partiWeightedSkillScore, globalMin, globalMax, minSkillFactor, maxSkillFactor);

    // return whole nums
    return Math.round(normalized);
}


// FIND SKILL
function findSkillName(skillId) {
    const foundSkill = DB.skills.find(currSkill => currSkill.id === skillId);
    if (!foundSkill) return `Skill with id ${skillId} not found`;
    return foundSkill.name;
}


// FILTER SEASONS
function filterSeasons(seasonYear) {
    const seasons = [];
    for (let i = 0; i < DB.seasons.length; i++) {
        // add one season, or all
        if (seasonYear === null || DB.seasons[i].year === seasonYear) {
            seasons.push(DB.seasons[i]);
        }
    }
    if (!seasons[0]) return `Season year ${seasonYear} not found`;
    return seasons;
}


// CALC EARNED SCORES PER DISC. AND PARTIC. (per season)
function calcScoresByPartiAndDisci(seasons) {

    const scoresByPartiAndDisci = {}; // { pId: { dId: score } }

    // loop seasons [i]
    for (let i = 0; i < seasons.length; i++) {
        const previousScoresByParti = {}; // { pId: prevScore }
        const currSeason = seasons[i]; // { pId: { dId: score, dId: score} }

        // loop comp. days (in currSeason) [j]
        for (let j = 0; j < currSeason.competitionDays.length; j++) {
            const currDay = currSeason.competitionDays[j];

            // loop events (in comp.day) [k]
            for (let k = 0; k < currDay.events.length; k++) {
                const currEvent = currDay.events[k];

                // loop scores (in event) [l]
                for (let l = 0; l < currEvent.scores.length; l++) {

                    const currPartiId = currEvent.scores[l].participantId;
                    const currScore = currEvent.scores[l].score;
                    const currDiscId = currEvent.disciplineId;

                    // find previous parti. score
                    const prevScore = previousScoresByParti[currPartiId] || 0;

                    // calc earned score (in current event)
                    const earnedScore = currScore - prevScore;

                    // update previous parti. score
                    previousScoresByParti[currPartiId] = currScore;

                    // create missing obj/fields
                    if (!scoresByPartiAndDisci[currPartiId]) scoresByPartiAndDisci[currPartiId] = {};
                    if (!scoresByPartiAndDisci[currPartiId][currDiscId]) scoresByPartiAndDisci[currPartiId][currDiscId] = 0;

                    // update earned scores
                    scoresByPartiAndDisci[currPartiId][currDiscId] += earnedScore;

                }
            }
        }
    }

    // (all) participanst scores in (all) disciplines 
    return scoresByPartiAndDisci;
}

// CALC INTERMEDIATE VALUES (tot. discipline score * skill weight)
function calcWeightedScoresInDisci(scoresByPartiAndDisci, skillName) {
    const partiWeightedSkillScores = {}; // { pId: weightedSkillScore }

    // loop partic. [i]
    for (let i = 0; i < DB.participants.length; i++) {

        const currPartiId = DB.participants[i].id;
        const currPartiDisciScores = scoresByPartiAndDisci[currPartiId] || {};
        let total = 0;

        // loop disc. [j]
        for (let j = 0; j < DB.disciplines.length; j++) {

            const currDiscipline = DB.disciplines[j];
            // find parti. totScore (in disc.) 
            const partiTotScoreDisci = currPartiDisciScores[currDiscipline.id] || 0;
            // find disc. (our skill)-factor weight
            const totSkillWeightDisci = currDiscipline.skillFactors[skillName] || 0;

            // weight (all) scores made in one discipline w/skill-factor
            total += partiTotScoreDisci * totSkillWeightDisci;

        }

        // save parti. tot. weighted skill score
        partiWeightedSkillScores[currPartiId] = total;

    }
    return partiWeightedSkillScores;
}


// FIND MIN/MAX IN SKILL
function findMinMaxSkillScores(partiWeightedSkillScores) {

    let globalMin = null, globalMax = null;

    for (const currPartiId in partiWeightedSkillScores) {
        // find the lowest and highest aver. (gMin/gMax)
        const currWeightedSkillScore = partiWeightedSkillScores[currPartiId];
        if (
            globalMin === null ||
            currWeightedSkillScore < globalMin
        ) globalMin = currWeightedSkillScore;
        if (
            globalMax === null ||
            currWeightedSkillScore > globalMax
        ) globalMax = currWeightedSkillScore;
    }

    const minMax = { globalMin, globalMax };
    return minMax;

}


// NORMALIZE (linear interpolaation)
function normalize(partiWeightedSkillScore, globalMin, globalMax, minSkillFactor, maxSkillFactor) {

    // how wide is the entire range of values?
    const range = globalMax - globalMin;

    // how far from the bottom is our participant?
    const distanceFromMin = partiWeightedSkillScore - globalMin;

    // what fraction of the range is our participant? (0.0 - 1.0)
    const fraction = distanceFromMin / range;

    // keep range modular if interval changes
    const skillFactorRange = maxSkillFactor - minSkillFactor;
    const normalized = (fraction * skillFactorRange) + minSkillFactor;

    return Math.round(normalized);
}
