import DB from "../../../api/services/DBAccessTest.js";

let season = DB.seasons[0].competitionDays;
console.log(season)
let totalParticipants = {};

// for (let i = 0; i < seasons[0].competitionDays; i++) {

//     if (i !== 2) {

for (let i = 0; i < season.length; i++) {



    for (let event of season[i].events) {

        for (let participant of event.scores) {

            let participantId = participant.participantId;


            if (!totalParticipants[participantId]) {

                totalParticipants = { ...totalParticipants, [participantId]: { participatedTimes: 1 } };

            }

            totalParticipants[participantId].participatedTimes++;

        }
    }

}
//     }
// }

console.log(totalParticipants);
console.log(Object.keys(totalParticipants).length)

// if (totalParticipants.some(object => object.participantId != participant.participantId)) {
//     totalParticipants.push({ participantId: participant.participantId, participatedTimes: 1 });
// } 
// totalParticipants