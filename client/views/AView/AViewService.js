// USE FUNCTION, AND ONLY ONE FUNCTION FOR ALL FILTERS, DISCIPLINES, LOCATIONS and SEASONS, and SEND IN THE ARGUMENTS AS AN OBJECT IN FUNCTION

import { DB } from "../../../backend/services/DBAccess.js";

export const ASections = {

    eventsLocation: [],
    totalParticipants: { allLocation: { participants: [] }, discipline: { id: 0, participants: [] }, season: { id: 0, participants: [] } },


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

    getParticipants: function (participantId) {
        if (participantId != undefined) {
            for (let participant of DB.participants) {
                if (participant.id == participantId) {
                    return participant;
                }
            }
        } else {
            return DB.participants;
        }
    },


    manageParticipant: function () {

    },

    resetCurrentFilter: function (categoryName, categoryId) {

        if (this.totalParticipants[categoryName].participants.length == 0) {
            this.totalParticipants[categoryName].participants = structuredClone(this.totalParticipants.allLocation.participants);
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


    getAverageScore: function (categoryArray) {
        for (let participant of categoryArray) {
            participant.score = Math.round(participant.score / participant.competeingTimes);
        }
    },


    getMaxDomain() {
        let seasons = this.getSeasons();

        let allEvents = [];
        let allScores = [];
        let allParticipants = [];

        for (let season of seasons) {
            for (let compDay of season.competitionDays) {
                allEvents.push(compDay.events);
            }
        }

        allEvents = allEvents.flatMap(event => event);

        for (let event of allEvents) {
            for (let score of event.scores) {
                allScores.push(score);
            }
        }

        for (let score of allScores) {
            let findParticipant = allParticipants.find(participant => participant.participantId == score.participantId);

            if (!findParticipant) {
                allParticipants.push({ participantId: score.participantId, competeingTimes: 1, score: score.score });

            } else {
                findParticipant.score += score.score;
                findParticipant.competeingTimes++;
            }

        }

        this.getAverageScore(allParticipants);

        let maxValue = 0;
        for (let participant of allParticipants) {
            if (participant.score > maxValue) {
                maxValue = participant.score;
            }
        }

        console.log(maxValue)

        return maxValue;


    },


    mainFilterLocationScore: function (locationId) {
        this.totalParticipants.allLocation.participants = [];
        this.totalParticipants.season.id = 0;
        this.totalParticipants.season.participants = [];
        this.totalParticipants.discipline.id = 0;
        this.totalParticipants.discipline.participants = [];

        let compDaysLocation = [];

        // LOOPING THROUGH SEASONS
        let compDays = this.getSeasons().flatMap(season => season.competitionDays);

        for (let compDay of compDays) {
            if (locationId == compDay.locationId) {
                compDaysLocation.push(compDay);
            }
        }

        // LOOPING THROUGH COMPDAYS
        let events = compDaysLocation.flatMap(compDay => compDay.events);

        this.eventsLocation = events;



        // LOOPING THROUGH PARTICIPANTS SCORE

        for (let event of this.eventsLocation) {

            for (let participant of event.scores) {

                let savedParticipant = this.totalParticipants.allLocation.participants.find(partici => partici.participantId == participant.participantId);

                let participantColor = this.getParticipants(participant.participantId).color;

                if (!savedParticipant) {
                    this.totalParticipants.allLocation.participants.push({ participantId: participant.participantId, score: participant.score, competeingTimes: 1, color: participantColor });

                } else {
                    savedParticipant.score += participant.score;
                    savedParticipant.competeingTimes++;
                }
            }
        }


        // FILTER OUT WRONG PARTICIPANT FOR LOCATION AND CALCULATE AVERGAE SCORE AND ADD NAME
        for (let participant of this.totalParticipants.allLocation.participants) {
            let storedParticipant = DB.participants.find(partici => partici.id == participant.participantId);
            if (storedParticipant.locationId != locationId) {
                this.totalParticipants.allLocation.participants = this.totalParticipants.allLocation.participants.filter(partici => partici.participantId != storedParticipant.id);
            }

            participant.name = storedParticipant.name;

        }

        this.getAverageScore(this.totalParticipants.allLocation.participants);

        return this.totalParticipants.allLocation.participants;
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


        } else {
            for (let event of this.eventsLocation) {

                if (event.disciplineId == Number(disciplineId)) {
                    eventsPerDiscipline.push(event);
                }
            }

        }


        this.resetCurrentFilter("discipline", disciplineId);


        this.extractParticipants("discipline", eventsPerDiscipline);


        this.getAverageScore(this.totalParticipants.discipline.participants);


        return this.totalParticipants.discipline.participants;

    },




    mainFilterSeasonScore: function (seasonYear) {

        let eventsPerSeason = [];

        let compDays = this.getSeasons(seasonYear).competitionDays;

        for (let compDay of compDays) {
            eventsPerSeason.push(compDay.events);
        }

        eventsPerSeason = eventsPerSeason.flatMap(event => event)


        if (this.totalParticipants.discipline.participants.length > 0) {
            eventsPerSeason.filter(event => event.disciplineId == this.totalParticipants.discipline.disciplineId);
        }


        this.resetCurrentFilter("season", seasonYear);


        this.extractParticipants("season", eventsPerSeason);


        this.getAverageScore(this.totalParticipants.season.participants);

        return this.totalParticipants.season.participants;

    }
}

ASections.getMaxDomain();