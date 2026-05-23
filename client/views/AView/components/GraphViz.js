
import { ASections } from "../AViewService.js";

class GraphViz extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.locationId;
        this.render();
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
        svg.selectAll("*").remove();


        function getMax() {
            let maxValue = 0;
            for (let object of data) {
                if (object.score > maxValue) {
                    maxValue = object.score;
                }
            }
            return maxValue;
        }


        let scaleX = d3.scaleLinear()
            .domain([1100, getMax()])
            .range([125, 225]);

        let scaleY = d3.scaleBand()
            .domain(data.map(object => object.name))
            .range([50, 550])
            .paddingInner(0.7);

        let containerGroup = svg.selectAll(".bar-group")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar-group")
            .attr("id", d => d.participantId)


        // BACKGROUNDS RECTS
        containerGroup.append("rect")
            .attr("x", 150)
            .attr("y", d => scaleY(d.name))
            .attr("width", 225)
            .attr("height", scaleY.bandwidth())
            .attr("fill", "white")
            .attr("rx", 2)
            .attr("ry", 2)


        // VALUE RECTS
        containerGroup.append("rect")
            // .transition(1000)
            .attr("x", 150)
            .attr("y", d => scaleY(d.name))
            .attr("width", d => scaleX(d.score))
            .attr("height", scaleY.bandwidth())
            .attr("fill", "#5FD5EC")
            .attr("rx", 2)
            .attr("ry", 2)


        // SCORE TEXT
        containerGroup.append("text")
            .attr("x", 450)
            .attr("y", d => scaleY(d.name) + 15)
            .text(d => d.score)
            .style("fill", "white")
            .style("font-size", "18px");

        containerGroup.append("text")
            .attr("x", 5)
            .attr("y", d => scaleY(d.name) + 15)
            .text(d => d.name)
            .style("fill", "white")
            .style("font-size", "18px");




        // Move into a method instead
        let notCompeted = data.filter(participant => participant.competeingTimes == 0);
        console.log(notCompeted)

        if (notCompeted.length >= 1) {
            for (let participant of notCompeted) {
                if (notCompeted.length >= 1) {
                    let group = this.shadowRoot.getElementById(`${participant.participantId}`);
                    let rect = group.childNodes[0];
                    let text = group.childNodes[2];

                    rect.style.fill = "grey";
                    text.textContent = "DNS";
                }
            }
        }


        this.addEventListeners();
    }

    addEventListeners() {

        let seasonDropDownSelections = this.shadowRoot.querySelectorAll("#seasonDropdown div");
        let disciplineDropDownSelections = this.shadowRoot.querySelectorAll("#disciplineDropdown div");

        for (let selection of seasonDropDownSelections) {

            selection.addEventListener("click", () => {

                this.getParticipantsBySeason(selection.innerHTML);

            })
        }

        for (let selection of disciplineDropDownSelections) {
            selection.addEventListener("click", () => {

                this.getParticipantsByDisciplines(selection.id);

            })
        }


        let allAgents = this.shadowRoot.querySelectorAll(".bar-group");
        console.log(allAgents)

        for (let agent of allAgents) {

            agent.addEventListener("click", (event) => {

                let data = { participantId: event.currentTarget.id };

                let customEvent = new CustomEvent("selected-agent", {
                    detail: data
                });

                window.dispatchEvent(customEvent);

            })
        }


    }

    eventListeners() {


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
                width: 125px;
                height: auto;
                background-color: white;
                position: absolute;
                padding-top: 15px;
                padding-bottom: 15px;
                top: 100%;
                left: 0;
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
                        <div>0</div>
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                        <div>4</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                        <div>8</div>
                        <div>9</div>
                    </div>
                </div>

                <div id="disciplineSelection" class="filterSelection">
                    <p>&#127942 DISCIPLINES</p>
                    <div id="disciplineDropdown" class="dropDown">
                        <div id="3">Debugging</div>
                        <div id="5">Information Disclosure</div>
                        <div id="2">Spread Disinformation</div>
                        <div id="1">Analyze data</div>
                        <div id="4">Track Digital Footprints</div>
                    </div>
                </div>
        
            </div>

        </div>
        `

    }

}

customElements.define("graph-viz", GraphViz);