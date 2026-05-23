class CountrySide extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.boundaries;
        this.render();
    }

    windowDetails(detail) {

        this.boundaries = detail.boundaries;
        this.d3Logic(detail.path);

    }

    d3Logic(path) {
        let svg = d3.select(this.shadowRoot).select("svg");
        svg.attr("height", this.boundaries.height).attr("width", this.boundaries.width);
        svg.style("left", `${this.boundaries.left}px`).style("top", `${this.boundaries.top}px`);

        svg.attr("viewBox", `${this.boundaries.x}, ${this.boundaries.y}, ${this.boundaries.width}, ${this.boundaries.height}`)

        svg.append("path").attr("d", path).attr("fill", "#0D1A2E").attr("stroke", "#34D399");

        svg.transition()
            .duration(2000)
            .style("left", null)
            .style("top", null);

    }



    render() {
        this.shadowRoot.innerHTML = `
        <style>

            svg {
                position: absolute;
                

            }

            @keyframes countryMoveIn {
                    from {
                        
                        transform: translateX(100%);
                    }

                    to {
                        transform: translateX(0%);
                    }
                }
            
           
        </style>

        <svg></svg>

        `

    }

}

customElements.define("country-side", CountrySide);