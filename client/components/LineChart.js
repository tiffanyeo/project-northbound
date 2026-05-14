export class LineChart extends HTMLElement{
    constructor(object, data){
        super();
        this.attachShadow({mode: "open"});

        this.hw = object;
        this.data = data;
    }
    connectedCallback(){
        this.render();
        this.d3Logic();
    }
    
    normalizeData(){
        const xs = this.data.x.datapoints;
        const ys = this.data.y.datapoints;

        const ySeries = Array.isArray(ys[0]) ? ys : [ys];

        console.log(xs);
        
        let normalized = ySeries.map((series, sIndex) =>
            series.map((yValue, i) => ({
                x: xs[sIndex],
                y: yValue
            })));

        return normalized;
    }

    createXScale(xs, wPadding, wViz) {
        const first = xs[0];

        if (typeof first === "string") {
            return d3.scaleBand(xs, [wPadding, wPadding + wViz]).padding(0.2);
        }

        return d3.scaleLinear()
            .domain(d3.extent(xs))
            .range([wPadding, wPadding + wViz]);
    }

    d3Logic(){
        const { hSvg, wSvg, hPadding, wPadding } = this.hw;

        const hViz = hSvg - hPadding * 2;
        const wViz = wSvg - wPadding * 2;

        let svg = d3.select(this.shadowRoot.querySelector("#linechart"));

        const normalized = this.normalizeData();
        const xs = this.data.x.datapoints;

        const xScale = this.createXScale(xs, wPadding, wViz)

        const yScale = d3.scaleLinear([this.data.max, this.data.min], [hPadding, hViz + hPadding])


        svg.append("g")
            .attr("transform", `translate(${wPadding}, 0)`)
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
        
        let dMakerFunc = d3.line()
                            .x(d=> xScale(d.x))
                            .y(d => yScale(d.y));

        normalized.forEach(series => {
            svg.append("path")
                .datum(series)
                .attr("fill", "none")
                .attr("stroke", "#3EB51C")
                .attr("stroke-width", 2)
                .attr("d", dMakerFunc);
        })
        
    }

    render(){
       this.shadowRoot.innerHTML = `
            <svg id="linechart" width="${this.hw.wSvg}" height="${this.hw.hSvg}" color="#3EB51C"></svg>
        `;
    }
    
    

}

customElements.define("line-chart", LineChart);