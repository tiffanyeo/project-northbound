
import { ASections } from "../AViewService.js";

class GraphViz extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.locationId;
        this.maxDomain = ASections.getMaxDomain();
        this.render();
        this.filterListeners();
    }


    getParticipantsScoreByLocation(locationId) {
        // this.locationId = locationId;
        // let participantsByLocation = new AService(null, null, locationId);
        // let data = participantsByLocation.getParticipantsByLocation();
        let data = ASections.mainFilterLocationScore(locationId);
        this.d3Logic(data);
    }

    getParticipantsByDisciplines(discipline) {
        let data = ASections.mainFilterDisciplineScore(discipline)
        this.d3Logic(data);
    }

    getParticipantsBySeason(season) {
        let data = ASections.mainFilterSeasonScore(season);
        this.d3Logic(data);
    }


    async d3Logic(data) {

        let width = 500;
        let height = 600;
        let padding = 50;

        let svg = d3.select(this.shadowRoot.querySelector("svg"))
            .attr("width", 500)
            .attr("height", 600)

        // Rensa allt ur SVG elementet genom selectAll * och remove()

        console.log(data)
        // function getMax() {
        //     let maxValue = 0;
        //     for (let object of data) {
        //         if (object.score > maxValue) {
        //             maxValue = object.score;
        //         }
        //     }
        //     return maxValue;
        // }


        let scaleX = d3.scaleLinear()
            .domain([1000, this.maxDomain])
            .range([125, 225]);

        let scaleY = d3.scaleBand()
            .domain(data.map(object => object.name))
            .range([50, 550])
            .paddingInner(0.7);


        let containerGroup = svg.selectAll(".bar-group")
            .data(data, d => d.name)

        let newGroup = containerGroup.enter()
            .append("g")
            .attr("class", "bar-group")
            .attr("id", d => d.participantId)


        // BACKGROUND RECTS
        newGroup.append("rect")
            .attr("x", 150)
            .attr("y", d => scaleY(d.name))
            .attr("width", 225)
            .attr("height", scaleY.bandwidth())
            .attr("fill", "white")
            .attr("rx", 2)
            .attr("ry", 2)

        // SCORE RECTS
        newGroup.append("rect")
            .attr("x", 150)
            .attr("y", d => scaleY(d.name))
            .attr("width", 0)
            .attr("height", scaleY.bandwidth())
            .attr("fill", d => d.color)
            // .attr("fill", "#5FD5EC")
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("id", "score-rect")

        // SCORE TEXT
        newGroup.append("text")
            .attr("x", 435)
            .attr("y", d => scaleY(d.name) + 15)
            .text(d => d.score)
            .attr("fill", "white")
            .style("font-size", "18px")
            .attr("id", "score-text")

        // AGENT NAME TEXT
        newGroup.append("text")
            .attr("x", 35)
            .attr("y", d => scaleY(d.name) + 20)
            .text(d => d.name)
            .attr("fill", "white")
            .style("font-size", "18px")
            .attr("class", "score-rect")

        // AGENT COLOR CIRCLE
        newGroup.append("circle")
            .attr("cx", 10)
            .attr("cy", d => scaleY(d.name) + 15)
            .attr("r", 8)
            .attr("fill", d => d.color)
            .attr("class", "score-rect")


        containerGroup.exit().remove()


        // MERGING WHOLE GROUP WITH ALL RECT AND CIRCLES AND TEXT
        let allMerged = containerGroup.merge(newGroup)
            .transition()
            .duration(500)


        // UPDATING ONLY SELECTED RECT AND TEXT
        allMerged.select("#score-rect").attr("width", d => scaleX(d.score))
        allMerged.select("#score-text").text(d => d.score)



        // Move into a method instead
        let notCompeted = data.filter(participant => participant.competeingTimes == 0);

        if (notCompeted.length >= 1) {
            for (let participant of notCompeted) {
                let partici = this.shadowRoot.getElementById(participant.participantId);
                console.log(partici)
                let rect = partici.childNodes[0];
                let text = partici.childNodes[2];
                console.log(text);
                console.log(rect)
                
                rect.style.fill = "grey";
                text.textContent = "DNS";
            }

        }

        this.agentsListeners()

    }

    filterListeners() {

        let seasonDropDownSelections = this.shadowRoot.querySelectorAll("#seasonDropdown div");
        let disciplineDropDownSelections = this.shadowRoot.querySelectorAll("#disciplineDropdown div");

        for (let selection of seasonDropDownSelections) {
            selection.addEventListener("click", (event) => {
                console.log("This is selection", selection);

                this.getParticipantsBySeason(selection.id);

            })
        }

        for (let selection of disciplineDropDownSelections) {
            selection.addEventListener("click", () => {

                this.getParticipantsByDisciplines(selection.id);

            })
        }


    }

    agentsListeners() {
        let allAgents = this.shadowRoot.querySelectorAll(".bar-group");
        console.log(allAgents)
        for (let agent of allAgents) {
            console.log(agent)
            agent.addEventListener("click", (event) => {

                let data = { participantId: event.currentTarget.id };

                let customEvent = new CustomEvent("selected-agent", {
                    detail: data
                });

                window.dispatchEvent(customEvent);

            })
        }


    }


    render() {
        this.shadowRoot.innerHTML = `
        <style>
            #vizBox {
                display: flex;
                flex-direction: column;
             
                background: linear-gradient( 135deg, rgba(44, 59, 79, 0.45) 0%,rgba(26, 38, 52, 0.6) 100%);
                // border: 2px solid #5FD5EC;
                border-radius: 10px;
                box-shadow: 0 0 20px rgb(232, 241, 248, 0.2);
            }
            
            #topPart {
                display:flex;
                justify-content: space-between;
                // background-color: #5FD5EC;
                padding-left: 15px;
                padding-right: 15px;
                font-size: 16px;
                color: white;
                border-bottom: 1px solid #34D399;
            }

            #filters {
                display: flex;
                justify-content: center;
                gap: 150px;
                border-top: 1px solid #34D399;
                padding: 10px;
            }

            .filterSelection {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 125px;
                height: 40px;
                // background-color: #34D399;
                color: #34D399;
                border-radius: 5px;
                cursor: pointer;
                position: relative;
            }

            .dropDown {
                display: none;
                flex-direction: column;
                gap: 15px;
                justify-content: center;
                align-items: start;
                width: 100%;
                height: auto;
                background-color: white;
                position: absolute;
                padding-top: 15px;
                padding-bottom: 15px;
                bottom: 100%;
                left: 0;
                border-radius: 20px;
                background-color: #2c3b4f;
            }
            

            #seasonSelection:hover #seasonDropdown {
                display: flex;
             
            }

            #disciplineSelection:hover #disciplineDropdown {
                display: flex;
             
            }

            .bar-group:hover {
                stroke: green;
                cursor: pointer;
            }
            
            .bar-group {
                display: flex;
                align-items: center;
            }

        </style>
        <div id="vizBox">

            <div id="topPart">
                <p>AI MODELS</p>
                <p>AVERAGE SCORE</p>
            </div>

            <svg></svg>

            <div id="filters">
                <div id="seasonSelection" class="filterSelection">
                    <p>&#128197 SEASONS</p>
                    <div id="seasonDropdown" class="dropDown">
                        <div id="0">
                            <p>Season 1</p>
                        </div>
                        <div id="1">
                            <p>Season 2</p>
                        </div>
                        <div id="2">
                            <p>Season 3</p>
                        </div>
                        <div id="3">
                            <p>Season 4</p>
                        </div>
                        <div id="4">
                            <p>Season 5</p>
                        </div>
                        <div id="5">
                            <p>Season 6</p>
                        </div>
                        <div id="6">
                            <p>Season 7</p>
                        </div>
                        <div id="7">
                            <p>Season 8</p>
                        </div>
                        <div id="8">
                            <p>Season 9</p>
                        </div>
                        <div id="9">
                            <p>Season 10</p>
                        </div>
                    </div>
                </div>

                <div id="disciplineSelection" class="filterSelection">
                    <p>&#127942 DISCIPLINES</p>
                    <div id="disciplineDropdown" class="dropDown">
                        <div id="3">
                            <p>Debugging</p>
                        </div>
                        <div id="5">
                            <p>Information Disclosure</p>
                        </div>
                        <div id="2">
                            <p>Spread Disinformation</p>
                        </div>
                        <div id="1">
                            <p>Analyze data</p>
                        </div>
                        <div id="4">
                            <p>Track Digitial Footprints</p>
                        </div>
                    </div>
                </div>
        
            </div>

        </div>
        `

    }

}

customElements.define("graph-viz", GraphViz);