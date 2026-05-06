class A1 extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.d3Logic();
    }


    async d3Logic() {
        let response = await fetch("http://localhost:8000/getjsoncountrys");
        let responseData = await response.json();
        console.log(responseData);
        // let svg = this.shadowRoot.querySelector("svg");

        // svg.select("path")
        //     .data()



    }

    render() {
        this.shadowRoot.innerHTML = `
            <style></style>

            <svg></svg>
        
        `

    }

}

customElements.define("a1-comp", A1);