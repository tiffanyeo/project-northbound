
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
        this.locationId = locationId;
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

        let svg = d3.select(this.shadowRoot.querySelector("svg"))
            .attr("width", 500)
            .attr("height", 500);


        console.log(data)

        let scaleX = d3.scaleLinear()
            .domain([1000, this.maxDomain])
            .range([125, 225]);

        let scaleY = d3.scaleBand()
            .domain(data.map(object => object.name))
            .range([25, 475])
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
            .attr("id", "background-rect")

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
            .attr("x", 45)
            .attr("y", d => scaleY(d.name) + 15)
            .text(d => d.name)
            .attr("fill", "white")
            .style("font-size", "18px")
            .attr("class", "score-rect")

        // AGENT COLOR CIRCLE
        newGroup.append("circle")
            .attr("cx", 25)
            .attr("cy", d => scaleY(d.name) + 10)
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
        allMerged.select("#score-text")
            .text(d => {
                if (d.competeingTimes != 0) {
                    return d.score;
                } else {
                    return "DNS";
                }
            })
        allMerged.select("#background-rect")
            .style("fill", d => {
                if (d.competeingTimes == 0) {
                    return "grey";
                } else {
                    return "white";
                }
            })

        this.agentsListeners()

    }

    filterListeners() {

        let seasonDropDownSelections = this.shadowRoot.querySelectorAll("#seasonDropdown div");
        let disciplineDropDownSelections = this.shadowRoot.querySelectorAll("#disciplineDropdown div");
        let seasonFilterButton = this.shadowRoot.querySelector("#seasonSelection");
        let disciplineFilterButton = this.shadowRoot.querySelector("#disciplineSelection");
        let currentFiltersSeason = this.shadowRoot.querySelector("#currentSeasonFilter");
        let currentFiltersDiscipline = this.shadowRoot.querySelector("#currentDisciplineFilter")
        let clearFilterAll = this.shadowRoot.querySelector("#clearCurrentFilter");

        seasonFilterButton.addEventListener("click", () => {
            let seasonDropdown = this.shadowRoot.querySelector("#seasonDropdown");
            if (seasonDropdown.style.display == "none") {
                seasonDropdown.style.display = "flex";

            } else {
                seasonDropdown.style.display = "none";
            }

        })

        disciplineFilterButton.addEventListener("click", () => {
            let disciplineDropdown = this.shadowRoot.querySelector("#disciplineDropdown");
            if (disciplineDropdown.style.display == "none") {
                disciplineDropdown.style.display = "flex";
            } else {
                disciplineDropdown.style.display = "none";
            }

        })


        for (let selection of seasonDropDownSelections) {
            selection.addEventListener("click", () => {
                for (let selectedColor of seasonDropDownSelections) {
                    selectedColor.style.backgroundColor = "";
                }
                console.log("This is selection", selection);
                currentFiltersSeason.textContent = selection.textContent;
                selection.style.backgroundColor = "rgba(0, 255, 0, 0.14)";
                this.getParticipantsBySeason(selection.id);

            })
        }

        for (let selection of disciplineDropDownSelections) {
            selection.addEventListener("click", () => {
                for (let selectedColor of disciplineDropDownSelections) {
                    selectedColor.style.backgroundColor = "";
                }
                currentFiltersDiscipline.textContent = selection.textContent;
                selection.style.backgroundColor = "rgba(0, 255, 0, 0.14)";
                this.getParticipantsByDisciplines(selection.id);

            })
        }

        clearFilterAll.addEventListener("click", () => {
            for (let selectedColor of disciplineDropDownSelections) {
                selectedColor.style.backgroundColor = "";
            }
            for (let selectedColor of seasonDropDownSelections) {
                selectedColor.style.backgroundColor = "";
            }
            currentFiltersSeason.textContent = "All seasons"
            currentFiltersDiscipline.textContent = "All disciplines"
            this.getParticipantsScoreByLocation(this.locationId)
        })


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
                position: relative;
            }


            #graph {
                display: flex;
                flex-direction: column;
             
                background: linear-gradient(rgba(44, 59, 79, 0.45) 0%,rgba(26, 38, 52, 0.6) 100%);
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

            #currentFilters {
                display: flex;
                border-bottom: 1px solid #34D399;
                color: white;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                padding-left: 15px;
                padding-right: 15px;
                
            }
        
            .currentFilter {
                background-color: rgba(0, 255, 0, 0.14);
                padding: 5px;
                border-radius: 5px;
                
            }
            
            #clearCurrentFilter {
                background-color: rgba(255, 30, 0, 0.14);
                padding: 5px;
                border-radius: 5px;
                cursor: pointer;
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
               
            }

            .dropDown {
                position: absolute;
                display: none;
                flex-direction: column;
                width: 100px;
                height: 645px;
                background-color: white;
                padding: 10px;
                background-color: #2c3b4f;
            }

            #seasonDropdown {
                border-top-left-radius: 20px;
                border-bottom-left-radius: 20px;
                left: -120px;
                top: 0;
               
            } 

            #disciplineDropdown {
               border-top-right-radius: 20px;
               border-bottom-right-radius: 20px;
               right: -120px;
               top: 0;
            }
               

            .dropDown div {
                width: 100px;
                border-top: 1px solid #34D399;
                border-bottom: 1px solid #34D399;
                cursor: pointer;
            }

            .dropDown div:hover {
             background-color: rgba(0, 255, 0, 0.14);
             
            }
            
         
            
            .dropDown div p {
                color: white;
            }

            h3 {
                color: white;
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

            <div id="seasonDropdown" class="dropDown">
                    <h3>Seasons</h3>
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

            <div id="graph">
        
                <div id="topPart">
                    <p>AI MODELS</p>
                    <p>AVERAGE SCORE</p>
                </div>

                <div id="currentFilters">
                    <p>CURRENT FILTERS:</p>
                    <p id="currentSeasonFilter" class="currentFilter">All seasons</p>
                    <p id="currentDisciplineFilter" class="currentFilter">All disciplines</p>
                    <p id="clearCurrentFilter">Clear all</p>
                </div>

                <svg></svg>

                <div id="filters">
                    <div id="seasonSelection" class="filterSelection">
                        <p>&#128197 SEASONS</p>
                    
                    </div>
                    <div id="disciplineSelection" class="filterSelection">
                        <p>&#127942 DISCIPLINES</p>
                    </div>
        
                </div>

            </div>
            

            <div id="disciplineDropdown" class="dropDown">
                <h3>Disciplines</h3>
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
        `

    }

}

customElements.define("graph-viz", GraphViz);