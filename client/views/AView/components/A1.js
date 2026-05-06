class A1 extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();
        this.d3Logic();
    }


    async d3Logic() {
        let response = await fetch("http://localhost:8000/getjsoncountrys");
        let responseData = await response.json();
        console.log(responseData);

        let svg = d3.select(this.shadowRoot)
            .select("svg");

        let projection = d3.geoMercator()
            .center([62.8457, 4.0843])
            .scale(800)
            .translate([1500, 1500])

        let path = d3.geoPath().projection(projection)

        svg.selectAll("path")
            .data(responseData.parsedContent)
            .enter()
            .append("path")
            .attr("d", path);



    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                svg {
                    border: 3px solid green;
                }
            </style>

            <svg width="1500" height="800"></svg>
        
        `

    }

}

customElements.define("a1-comp", A1);