// USE FUNCTION, AND ONLY ONE FUNCTION FOR ALL FILTERS, DISCIPLINES, LOCATIONS and SEASONS, and SEND IN THE ARGUMENTS AS AN OBJECT IN FUNCTION

import { DB } from "../../../backend/services/DBAccess.js";

console.log(DB)
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

    compDaysLocation: [],
    eventsLocation: [],
    totalParticipants: { all: [], discipline: { id: 0, participants: [] }, season: { id: 0, participants: [] } },


    getSeasons: function (seasonYear) {

        if (seasonYear != undefined) {
            for (let season of DB.seasons) {
                if (season.year == seasonYear) {
                    return season;
                }
            }
        } else {
            return DB.seasons;
        }
    },

    manageParticipant: function () {

    },

    resetCurrentFilter: function (categoryName, categoryId) {

        if (this.totalParticipants[categoryName].participants.length == 0) {
            this.totalParticipants[categoryName].participants = structuredClone(this.totalParticipants.all);
        }

        this.totalParticipants[categoryName].id = Number(categoryId);

        for (let participant of this.totalParticipants[categoryName].participants) {
            participant.score = 0;
            participant.competeingTimes = 0;
        }

    },

    extractParticipants: function (category, categoryEventsArray) {

        let participants = categoryEventsArray.flatMap(event => event.scores);
        for (let participant of participants) {

            let participantLocation = this.totalParticipants[category].participants.find(partici => partici.participantId == participant.participantId);

            if (participantLocation) {


                participantLocation.score += participant.score;
                participantLocation.competeingTimes++
            }
        }
    },


    getAverageScore: function (category) {
        for (let participant of this.totalParticipants[category].participants) {
            participant.score = Math.round(participant.score / participant.competeingTimes);
        }
    },


    mainFilterLocationScore: function (locationId) {

        // LOOPING THROUGH SEASONS
        let compDays = this.getSeasons().flatMap(season => season.competitionDays);
        console.log(compDays)
        for (let compDay of compDays) {
            if (locationId == compDay.locationId) {
                this.compDaysLocation.push(compDay);
            }
        }

        console.log(this.compDaysLocation)
        // LOOPING THROUGH COMPDAYS
        let events = this.compDaysLocation.flatMap(compDay => compDay.events);

        this.eventsLocation = events;




        // LOOPING THROUGH PARTICIPANTS SCORE

        for (let event of this.eventsLocation) {

            for (let participant of event.scores) {

                let savedParticipant = this.totalParticipants.all.find(partici => partici.participantId == participant.participantId);

                if (!savedParticipant) {
                    this.totalParticipants.all.push({ participantId: participant.participantId, score: participant.score, competeingTimes: 1 });

                } else {
                    savedParticipant.score += participant.score;
                    savedParticipant.competeingTimes++;
                }
            }
        }



        // FILTER OUT WRONG PARTICIPANT FOR LOCATION AND CALCULATE AVERGAE SCORE AND ADD NAME
        for (let participant of this.totalParticipants.all) {
            console.log(participant)
            let storedParticipant = DB.participants.find(partici => partici.id == participant.participantId);
            console.log(storedParticipant)
            if (storedParticipant.locationId != locationId) {
                this.totalParticipants.all = this.totalParticipants.all.filter(partici => partici.participantId != storedParticipant.id);
            }

            participant.name = storedParticipant.name;
            participant.score = Math.round(participant.score / participant.competeingTimes);
        }

        console.log(this.totalParticipants.all)
        return this.totalParticipants.all;
    },


    mainFilterDisciplineScore: function (disciplineId) {

        let eventsPerDiscipline = [];

        if (this.totalParticipants.season.participants.length > 0) {
            let compDays = this.getSeasons(this.totalParticipants.season.id).competitionDays;

            for (let compDay of compDays) {
                for (let event of compDay.events) {


                    if (event.disciplineId == disciplineId) {
                        eventsPerDiscipline.push(event);
                    }
                }
            }

            console.log(eventsPerDiscipline)

        } else {
            for (let event of this.eventsLocation) {

                if (event.disciplineId == Number(disciplineId)) {
                    eventsPerDiscipline.push(event);
                }
            }

        }

        console.log(eventsPerDiscipline)


        this.resetCurrentFilter("discipline", disciplineId);


        this.extractParticipants("discipline", eventsPerDiscipline);


        this.getAverageScore("discipline");


        console.log(this.totalParticipants);
        return this.totalParticipants.discipline.participants;

    },




    mainFilterSeasonScore: function (seasonYear) {

        let eventsPerSeason = [];

        let compDays = this.getSeasons(seasonYear).competitionDays;

        for (let compDay of compDays) {
            console.log(event)
            eventsPerSeason.push(compDay.events);
        }

        eventsPerSeason = eventsPerSeason.flatMap(event => event)


        if (this.totalParticipants.discipline.participants.length > 0) {
            eventsPerSeason.filter(event => event.disciplineId == this.totalParticipants.discipline.disciplineId);
        }


        this.resetCurrentFilter("season", seasonYear);


        this.extractParticipants("season", eventsPerSeason);


        this.getAverageScore("season");

        console.log(this.totalParticipants)
        return this.totalParticipants.season.participants;

    }
}