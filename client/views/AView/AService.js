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



class AService {

    constructor(discipline, season, locationId) {
        this.DB = DB;
        this.chosenDicsiplineName = discipline;
        this.chosenSeasonNum = season;
        this.locationId = locationId;
        this.totalScore = [];
        this.getAllScore();
    }

    getSeason() {
        if (!this.chosenSeasonNum) {
            return DB.seasons;
        } else {
            let filterdSeason = this.DB.seasons.find(season => season.year == this.chosenSeasonNum);
            return filterdSeason;
        }
    }

    getDiscipline() {
        if (!this.chosenDicsiplineName) {
            return DB.disciplines;
        } else {
            let filteredDiscipline = this.DB.disciplines.find(discipline => discipline.name == this.chosenDicsiplineName);

            return filteredDiscipline;
        }
    }

    getAllScore() {

        for (let compDay of this.getSeason()["competitionDays"]) {

            if (this.locationId == compDay.locationId) {

                for (let event of compDay.events) {

                    // Denna kollar bara om en det är en disciplines, men inte om det är alla disciplines, kollar över det sen
                    if (event.disciplineId == this.getDiscipline().id) {

                        for (let participant of event.scores) {

                            if (!this.totalScore.some(partici => partici.id == participant.participantId)) {

                                console.log("hehjj")

                                this.totalScore.push({ id: participant.participantId, score: participant.score });

                            } else {

                                for (let partici of this.totalScore) {

                                    if (partici.id == participant.participantId) {

                                        partici.score += participant.score;

                                    }


                                }
                            }
                        }
                    }
                }
            }
        }
        console.log(this.totalScore);
    }



}



new AService("Debugging", 1, 3);



// if (totalParticipants.some(object => object.participantId != participant.participantId)) {
//     totalParticipants.push({ participantId: participant.participantId, participatedTimes: 1 });
// } 
// totalParticipants