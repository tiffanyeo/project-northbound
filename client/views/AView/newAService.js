// USE FUNCTION, AND ONLY ONE FUNCTION FOR ALL FILTERS, DISCIPLINES, LOCATIONS and SEASONS, and SEND IN THE ARGUMENTS AS AN OBJECT IN FUNCTION

import DB from "../../../api/services/DBAccessTest.js";

// TEST WITH ARRAY METHODS
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
                findParticipant.score += current.score;
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



export const ASections = {

    getAverageScoreLocation: function (locationId) {

        let compDaysLocation = [];
        let participantsScore = [];
        let totalParticipants = [];

        // LOOPING THROUGH SEASONS
        for (let season of DB.seasons) {
            for (let compDay of season.competitionDays) {
                if (locationId == compDay.locationId) {
                    compDaysLocation.push(compDay);
                }
            }
        }

        // LOOPING THROUGH COMPDAYS
        for (let compDay of compDaysLocation) {
            for (let event of compDay.events) {
                for (let participantObject of event.scores) {
                    participantsScore.push(participantObject);
                }
            }
        }

        // LOOPING THROUGH PARTICIPANTS SCORE
        for (let participant of participantsScore) {
            let savedParticipant = totalParticipants.find(partici => partici.participantId == participant.participantId);

            if (!savedParticipant) {
                totalParticipants.push({ participantId: participant.participantId, score: participant.score, competeingTimes: 1 });

            } else {
                savedParticipant.score += participant.score;
                savedParticipant.competeingTimes++;
            }
        }


        // FILTER OUT WRONG PARTICIPANT FOR LOCATION AND CALCULATE AVERGAE SCORE AND ADD NAME
        for (let participant of totalParticipants) {
            let storedParticipant = DB.participants.find(partici => partici.id == participant.participantId);

            if (storedParticipant.locationId != locationId) {
                totalParticipants = totalParticipants.filter(partici => partici.participantId != storedParticipant.id);
            }

            participant.name = storedParticipant.name;
            participant.score = Math.round(participant.score / participant.competeingTimes);
        }

        return totalParticipants;
    },


    filterDisciplineScore: function () {


    },

    filterSeasonScore: function () {



    }
}