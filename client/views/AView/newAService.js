// USE FUNCTION, AND ONLY ONE FUNCTION FOR ALL FILTERS, DISCIPLINES, LOCATIONS and SEASONS, and SEND IN THE ARGUMENTS AS AN OBJECT IN FUNCTION

import { DB } from "../../../backend/services/DBAccess.js";

function averageScore(options = { locationId, seasonId, disciplineId }) {

    // EXAMPLE OBJECT
    let totalParticipants = [{ participantId: 0, score: 200, competingtimes: 2 }];


    if (options.seasonId == undefined && options.disciplineId == undefined) {

        let competitionDays = DB.seasons.map(object => object.competitionDays).filter(compDay => compDay.locationId == options.locationId);

        let events = competitionDays.map(compDay => compDay.events);

        let participants = events.map(event => event.scores);

        // NOT SURE IF REDUCE IS WORKING CORRECTLY HERE
        participants.reduce((accumulator, current) => {

            let findParticipant = accumulator.find(participant => participant.participantId == current.participantId);

            if (!findParticipant) {
                accumulator.push({ participantId: current.participantId, score: current.score, competingtimes: 1 });
            } else {
                findParticipant.score += curr.score;
                findParticipant.competingtimes++;
            }

            return accumulator;

        }, [])
        let getAverageScoreLocation;
    }

    if (options.seasonId == undefined) {
        // FILTER FOR DISCIPLINE
        let getAverageScoreSeason;
    }

    if (options.disciplineId == undefined) {
        // FILTER FOR SEASON
        let getAverageScoreDiscipline;
    }


    // OTHERWISE FILTER FOR ALL AND USE FLAT() TO COMBINE ALL THE ARRAYS TO ONE ARRAY




}