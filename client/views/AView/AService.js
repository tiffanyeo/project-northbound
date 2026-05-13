import DB from "../../../api/services/DBAccessTest.js";

// TEST ANALYZE OF DATA FOR COMPETInG TIMESS OF PARTICIPANTS IN ONE SEASON
let season = DB.seasons[2];
let compDays = season.competitionDays;

console.log(season)
let totalParticipants = {};

for (let i = 0; i < compDays.length; i++) {


    for (let event of compDays[i].events) {

        for (let participant of event.scores) {

            let participantId = participant.participantId;


            if (!totalParticipants[participantId]) {

                totalParticipants = { ...totalParticipants, [participantId]: { participatedTimes: 1 } };

            }

            totalParticipants[participantId].participatedTimes++;

        }
    }

}


console.log(totalParticipants);
console.log(Object.keys(totalParticipants).length)

// if (totalParticipants.some(object => object.participantId != participant.participantId)) {
//     totalParticipants.push({ participantId: participant.participantId, participatedTimes: 1 });
// } 
// totalParticipants