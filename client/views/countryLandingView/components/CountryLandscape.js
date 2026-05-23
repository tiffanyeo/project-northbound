import { countries } from "../../../../backend/services/countriesDBAccess.js";

class CountryLandscape extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
        this.d3Logic();
        this.addEventListeners();
    }


    async d3Logic() {
        // let response = await fetch("http://localhost:8000/getjsoncountrys");
        // let responseData = await response.json();
        // console.log(responseData);

        let data = countries;

        let svg = d3.select(this.shadowRoot)
            .select("svg");

        let projection = d3.geoMercator()
            .center([62.8457, 4.0843])
            .scale(1150)
            .translate([2000, 2000])

        let path = d3.geoPath().projection(projection)

        svg.selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "#0D1A2E")
            .attr("stroke", "#34D399")
            .attr("id", d => d.properties.countryId)
            .attr("class", d => d.properties.name);



    }

    addEventListeners() {
        let svg = this.shadowRoot.querySelector("svg");


        svg.addEventListener("click", (event) => {
            console.log(event.target)
            if (event.target.tagName == "path") {
                let data = { id: event.target.id, path: event.target.getAttribute("d"), boundaries: event.target.getBoundingClientRect() };

                let customEvent = new CustomEvent("selected-country", {
                    detail: data
                });

                window.dispatchEvent(customEvent);
            }


        })

    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                svg {
                    
                }
                path:hover {
                    cursor: pointer;
                    fill: rgba(0, 255, 0, 0.14);
                }

                .Sweden {
                    animation: moveInTop 3s ease-out;
                }

                .Denmark {
                    animation: moveInBottom 3s ease-out;
                }

                .Norway {
                    animation: moveInLeft 3.5s ease-out;
                }

                .Finland {
                    animation: moveInRight 3.5s ease-out;
                }

                .Iceland {
                    animation: moveInTop 4s ease-out;
                }
                
                
                @keyframes moveInTop {
                    from {
                        transform: translateY(-100%);
                    }

                    to {
                        transform: translateY(0%);
                    }
                }

                @keyframes moveInBottom {
                    from {
                        transform: translateY(100%);
                    }

                    to {
                        transform: translateY(0%);
                }   }

                @keyframes moveInLeft {
                    from {
                        transform: translateX(-100%);
                    }

                    to {
                        transform: translateX(0%);
                }   }

                @keyframes moveInRight {
                    from {
                        transform: translateX(100%);
                    }

                    to {
                        transform: translateX(0%);
                }   }

            </style>        

            <svg width="100%" height="100vh"></svg>
        
        `

    }

}

customElements.define("country-landing", CountryLandscape);