
import { DB } from "../DBAccess.js";
import { calcSkillFactor } from "../analyzers/SkillAnalyzer.js";

class agents {

    getSkillFactor(participantId, skillId, seasonYear = null) {
        const skillFactor = calcSkillFactor(participantId, skillId, seasonYear);
        return skillFactor;
    }

    getAllSkillFactors(participantId, seasonYear = null) {

        const skillFactors = {};

        // loop skills [i]
        for (let i = 0; i < DB.skills.length; i++) {

            const currSkill = DB.skills[i];
            const currSkillFactor = this.getSkillFactor(participantId, currSkill.id, seasonYear);

            skillFactors[currSkill.name] = currSkillFactor;
        }

        return skillFactors;
    }

    getBestSkill(participantId, seasonYear = null) {

        let bestSkillName = null;
        let bestSkillFactor = null;
        const skillFactors = this.getAllSkillFactors(participantId, seasonYear);

        // loop skills
        for (const currSkillName in skillFactors) {
            const currSkillFactor = skillFactors[currSkillName];
            if (bestSkillFactor === null || currSkillFactor > bestSkillFactor) {
                bestSkillFactor = currSkillFactor;
                bestSkillName = currSkillName;
            }
        }

        return {
            skillName: bestSkillName,
            skillFactor: bestSkillFactor
        };
    }

    getTopAgentsBySkill(skillId, seasonYear = null, limit = 5) {

        const topAgents = [];

        // loop participants [i]
        for (let i = 0; i < DB.participants.length; i++) {

            const currParti = DB.participants[i];
            const currSkillFactor = this.getSkillFactor(currParti.id, skillId, seasonYear);

            topAgents.push({
                participantId: currParti.id,
                name: currParti.name,
                skillFactor: currSkillFactor
            });
        }

        // sort highest -> lowest
        topAgents.sort(
            (a, b) => b.skillFactor - a.skillFactor
        );

        return topAgents.slice(0, limit);
    }
    
    getWorstAgentsBySkill(skillId, seasonYear = null, limit = 5) {

        const worstAgents = [];

        // loop participants [i]
        for (let i = 0; i < DB.participants.length; i++) {

            const currParti = DB.participants[i];
            const currSkillFactor = this.getSkillFactor(currParti.id, skillId, seasonYear);

            worstAgents.push({
                participantId: currParti.id,
                name: currParti.name,
                skillFactor: currSkillFactor
            });
        }

        // sort lowest -> highest
        worstAgents.sort(
            (a, b) => a.skillFactor - b.skillFactor
        );

        return worstAgents.slice(0, limit);
    }

}

export const Agents = new agents()