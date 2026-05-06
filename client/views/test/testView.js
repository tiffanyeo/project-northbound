import { BarChart } from "../../components/BarChart.js"

export class TestView extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"});
        this.render();
    }

    createBarChart(){

        const data = {
            bars: [
                {label: "PølsAI", value: 75}, 
                {label: "Ainok", value: 23},
                {label: "AIKEA", value: 65},
                {label: "Norwai", value: 34},
                {label: "gAIser", value: 90}
            ],
            max: 100,
            min: 0
        };
        const hw = {
            hSvg: 300,
            wSvg: 400,
            wPadding: 80,
            hPadding: 50
        }

        return new BarChart(hw, data);
    }
    render(){
        this.shadowRoot.innerHTML = `
            <style>
                #container {
                    background: #0D1A2E;
                }
            </style>
            <div id="container">
            </div>
        `;
        const chart = this.createBarChart();
        this.shadowRoot.querySelector("#container").appendChild(chart);
    }
}

customElements.define("test-view", TestView);