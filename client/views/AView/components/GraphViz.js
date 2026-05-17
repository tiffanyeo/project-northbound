import { AService } from "../AService.js";

class GraphViz extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();

    }


    getParticipantsScoreByLocation(locationId) {
        let participantsByLocation = new AService(null, null, locationId);
        let data = participantsByLocation.getParticipantsByLocation();
        this.d3Logic(data);
    }


    async d3Logic(data) {
        let svg = d3.select(this.shadowRoot.querySelector("svg"))
            .attr("width", 300)
            .attr("height", 500);

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
            .domain([0, getMax()])
            .range([50, 250]);

        let scaleY = d3.scaleBand()
            .domain(data.map(object => object.name))
            .range([50, 450])
            .padding(0.3);

        let leftAxis = d3.axisLeft(scaleY);

        svg.append("g")
            .call(leftAxis)
            .attr("transform", `translate(50, 0)`);

        console.log(data);
        svg.append("g").selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", 50)
            .attr("y", d => scaleY(d.name))
            .attr("width", d => scaleX(d.score))
            .attr("height", scaleY.bandwidth())
            .attr("fill", "#5FD5EC")

    }

    // addEventListener() {

    //     window.addEventListener("selected-country", (event) => {
    //         console.log("HSHS")
    //         let countryId = event.detail.id;
    //         this.getParticipantsScoreByLocation(countryId);
    //     })
    // }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            svg {
              
            }
        </style>

        <svg></svg>
        `

    }

}

customElements.define("graph-viz", GraphViz);