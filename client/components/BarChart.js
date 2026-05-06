//Tänker att man skickar in storlek på chart och padding så blir det så modulärt som möjligt.

/*
let object = {
    hSvg: 0,
    wSvg: 0,
    hPadding: 0,
    wPadding: 0,
}

let data = {
    bars: 
        [
            {
                label: "lala",
                value: 30
            },
            {
                label: "lola",
                value: 32
            }
        }
    ],
    max: 100,
    min: 0
    
}
*/

export class BarChart extends HTMLElement{
    constructor(object, data, sideways = true){
        super();
        this.attachShadow({mode: "open"});

        this.parent = this.parentNode;
        this.hw = object;
        this.data = data;
        this.sideways = sideways;
    }
    connectedCallback(){
        this.render();
        this.d3Logic();
    }

    d3Logic(){
        const { hSvg, wSvg, hPadding, wPadding } = this.hw;

        const hViz = hSvg - hPadding * 2;
        const wViz = wSvg - wPadding * 2;

        let svg = d3.select(this.shadowRoot.querySelector("#chart"));

        if (this.sideways){
            const xScale = d3.scaleLinear([0, this.data.max], [wPadding, wPadding + wViz]);

            const yScale = d3.scaleBand(this.data.bars.map(d=> d.label), [hPadding, hViz + hPadding])
                            .paddingInner(0.5)
                            .paddingOuter(.5);

            svg.append("g")
                .attr("transform", `translate(${wPadding}, 0)`)
                .attr("font-size", "18px")
                .call(d3.axisLeft(yScale))
                .selectAll("text")
                .attr("font-size", "12px")
                .attr("font-family", "monospace"); 

            svg.append("g")
                .attr("transform", `translate(0,${hPadding + hViz})`)
                .call(d3.axisBottom(xScale))
                .selectAll("text")
                .attr("font-size", "12px")
                .attr("font-family", "monospace");

            svg.selectAll("rect")
                .data(this.data.bars)
                .enter()
                .append("rect")
                .attr("x", wPadding)
                .attr("y", d => yScale(d.label))
                .attr("width", d => xScale(d.value) - wPadding)
                .attr("height", yScale.bandwidth())
                .attr("fill", "#3EB51C")
                .attr("stroke", "#a8eb95a6")
        }
        
    }

    render(){
       this.shadowRoot.innerHTML = `
            <svg id="chart" width="${this.hw.wSvg}" height="${this.hw.hSvg}" color="#3EB51C"></svg>
        `;
    }

    

}

customElements.define("bar-chart", BarChart);