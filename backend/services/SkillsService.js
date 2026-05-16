import { DB } from "./db.js";

export function calcParticipantSkills(participantId, minSkillFactor, maxSkillFactor) {
    /* if (minSkillFactor === undefined) minSkillFactor = 10;
    if (maxSkillFactor === undefined) maxSkillFactor = 20; */

    const disciplines = DB.disciplines;
    const participants = DB.participants;
    const seasons = DB.seasons;
    const skills = DB.skills;
    const skillNames = [];

    // Tot points (part. + disc.)
    const scoresByParticipantAndDiscipline = {};

    for (let i = 0; i < seasons.length; i++) {
        const season = seasons[i];

        for (let j = 0; j < season.competitionDays.length; j++) {
            const day = season.competitionDays[j];

            for (let k = 0; k < day.events.length; k++) {
                const event = day.events[k];

                for (let l = 0; l < event.scores.length; l++) {

                    const pId = event.scores[l].participantId;
                    const score = event.scores[l].score;
                    const disciplineId = event.disciplineId;

                    if (!scoresByParticipantAndDiscipline[pId]) {
                        scoresByParticipantAndDiscipline[pId] = {};
                    }

                    scoresByParticipantAndDiscipline[pId][disciplineId] += score;

                }
            }
        }
    }

    // Add skillnaames
    for (let i = 0; i < skills.length; i++) {
        skillNames.push(skills[i].name);
    }

    // Steg 1
    
    const intermediates = {};

    for (let i = 0; i < participants.length; i++) {
        
        const pId = participants[i].id;
        const disciplineScores = scoresByParticipantAndDiscipline[pId] || {};
        intermediates[pId] = {};

        for (let j = 0; j < skillNames.length; j++) {
            
            const skillName = skillNames[j];
            let total = 0;

            for (let k = 0; k < disciplines.length; k++) {
                
                const discipline = disciplines[k];
                const score = disciplineScores[discipline.id] || 0;
                const weight = discipline.skillFactors[skillName] || 0;
                total += score * weight;
                
            }

            intermediates[pId][skillName] = total;
        }
    }

    // Steg 2
    // Steg 3

}