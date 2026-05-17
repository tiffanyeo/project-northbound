class CountrySide extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.render();

    }

    getCountryPath() {

    }

    d3Logic(path) {
        let svg = d3.select(this.shadowRoot).select("svg");

        svg.append("path").attr("d", path).attr("fill", "#0D1A2E").attr("stroke", "#00FF00").attr("transform", "translate(-500, 0) scale(0.7)");


    }



    render() {
        this.shadowRoot.innerHTML = `
        <style>
            
        </style>

        <svg width="500px" height="700"></svg>

        `

    }

}

customElements.define("country-side", CountrySide);