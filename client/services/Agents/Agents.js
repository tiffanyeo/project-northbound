
import { DB } from "../DBAccess.js";
import { calcAgentSkills } from "./AgentSkills.js";

class agents {

    getSkillFactor(participantId, skillId, seasonYear = null) {
        const skillFactor = calcAgentSkills(participantId, skillId, seasonYear);
        return skillFactor;
    }

    // { Speed: 72, Accuracy: 70, "Token Power": 95, Intelligence: 60, Creativity: 54 }
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

    // Object { participantId: 154, name: "ØreByte", skillFactor: 70 },  {}
    getAgentsAverage (locationId = null, skillId = null, seasonYear = null, limit = 5) {

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

        // ALL LOCATIONS
        if (!locationId) {
            return topAgents.slice(0, limit);
        }

        // PER LOCATION
        const locationAgents = DB.participants.filter(p => p.locationId == locationId);
        const filteredAgents = topAgents.filter(currAgent =>
            locationAgents.some(currLocAgent => currLocAgent.id === currAgent.participantId)
        );
        
        return filteredAgents.slice(0, limit)
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