export default function createLineChartForAgent(hW, results, container, btnCont, hostC){
    const host = hostC;

    const ORIGINAL_RESULTS = results;

    const color = "#3EB51C";
    
    let max = 0;
    
    const seasons = cleanData(results)

    const maxScore = Math.max(...seasons.flatMap(s=>s.matches).flatMap(r=>r.score));

    let lastSeason = seasons[seasons.length -1];
    let lastx = lastSeason.matches[lastSeason.matches.length -1].x;

    const {hSvg, wSvg, hPadding, wPadding} = hW;

    const hViz = hSvg - hPadding * 2;
    const wViz = wSvg - wPadding * 2;

    const xScale = d3.scaleLinear([0, lastx], [wPadding, wViz + wPadding]);
    const yScale = d3.scaleLinear([maxScore, 0], [hPadding, hViz + hPadding])

    const xAxis = d3.axisBottom(xScale)
                    .tickValues(d3.range(0, lastx + 1));

    const yAxis = d3.axisLeft(yScale)
                    .tickValues([0, 1, 3, 6, 10, 15]);

    const yGrid = d3.axisLeft(yScale).tickSize(-wSvg).tickFormat("");

    let dMakerFunc = d3.line()
                        .x(d=> xScale(d.x))
                        .y(d=> yScale(d.score));

    let areaMaker = d3.area()
                        .x(d => xScale(d.x))
                        .y0(yScale(-1))
                        .y1(yScale(maxScore + hPadding));
    const bridgeArea = d3.area()
                    .x(d=> xScale(d.x))
                    .y0(yScale(0))
                    .y1(d=> yScale(d.score))

    const svg = d3.select(container);

    function allSeasonsLineChart(){

        svg.append("g")
            .attr("transform", `translate(${wPadding}, 0)`)
            .call(yAxis)
            .selectAll("text");

        svg.append("g")
            .attr("transform", `translate(0, ${hPadding + hViz})`)
            .attr("class", "x-axis")
            .call(xAxis)
            .selectAll("text")
            .attr("display", "none")

        svg.append("g")
            .attr("class", "ygrid")
            .call(yGrid)

        svg.selectAll(".season-line")
            .data(seasons)
            .enter()
            .append("path")
            .attr("class", "season-line")
            .attr("d", d=> dMakerFunc(d.matches))
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 1);


    //BridgeLine

        for (let i = 0; i < seasons.length; i++){
            if (!seasons[i+1]){
                continue;
            }
            const end = seasons[i].matches[seasons[i].matches.length -1];
            const start = seasons[i+1].matches[0];
            svg.append("line")
                .datum({x1: end.x,
                        y1: end.score,
                        x2: start.x,
                        y2: start.score
                })
                .attr("class", "bridge-line")
                .attr("x1", d => xScale(d.x1))
                .attr("y1", d => yScale(d.y1))
                .attr("x2", d => xScale(d.x2))
                .attr("y2", d => yScale(d.y2))
                .attr("stroke", color)
        }
        svg.append("line")
            .datum({
                x1: 0,
                y1: 0,
                x2: 1,
                y2: seasons[0].matches[0].score
                })
            .attr("class", "bridge-line")
            .attr("x1", d => xScale(d.x1))
            .attr("y1", d => yScale(d.y1))
            .attr("x2", d => xScale(d.x2))
            .attr("y2", d => yScale(d.y2))
            .attr("stroke", color)
    



        //Bridge Area //



        const first = seasons[0].matches[0];
        const firstBridge = [
            {x: 0, score: 0},
            {x: first.x, score: first.score},
        ];

        svg.append("path")
            .datum(firstBridge)
            .attr("class", "bridge-area")
            .attr("id", "b0")
            .attr("fill", "transparent")
            .attr("stroke", "none")
            .attr("d", bridgeArea);


        for (let i = 0; i < seasons.length - 1; i++){
            if (!seasons[i+1]){
                continue;
            }
            const end = seasons[i].matches[seasons[i].matches.length - 1];
            const start = seasons[i + 1].matches[0];

            const bridge = [
                {x: end.x, score: end.score},
                {x: start.x, score: start.score}
            ];


            svg.append("path")
                .datum(bridge)
                .attr("class", "bridge-area")
                .attr("id", `b${i+1}`)
                .attr("fill", "transparent")
                .attr("stroke", "none")
                .attr("d", bridgeArea);


        }
    
        const defs = svg.append("defs");

        const gradient = defs.append("linearGradient")
            .attr("id", "bridgeGradient")
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%");
        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "rgba(184, 254, 176, 0.1)")

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "rgba(184, 254, 176, 0.15)")

    
        seasons.forEach((s, sIndex) =>{
            svg.append("path")
                .datum(s.matches)
                .attr("class", "season-area")
                .attr("id", `S${sIndex + 1}`)
                .attr("fill", "transparent")
                .attr("d", areaMaker)
                .on("mouseover", function(){
                    const index = Number(this.id.slice(1) - 1);
                    d3.select(this).attr("fill", "rgba(184, 254, 176, 0.2)");
                    d3.select(this.ownerSVGElement).select(`#b${index}`).attr("fill", "url(#bridgeGradient");

                })
                .on("mouseout", function(){
                    const index = Number(this.id.slice(1) - 1);
                    d3.select(this).attr("fill", "transparent");
                    d3.select(this.ownerSVGElement).select(`#b${index}`).attr("fill", "transparent");
                })
        })
    }

    allSeasonsLineChart();

    function renderButtons(){
        const btnContainer = d3.select(btnCont);
        btnContainer.selectAll("*").remove();

        const btnG = btnContainer.append("g").attr("class", "season-buttons");

        const participatingSeasons = ORIGINAL_RESULTS.filter(s => s.participated == true).map(s => s.season);
        seasons.forEach(s=> {
            const participated = participatingSeasons.some(ps => ps == s.season);
            if (!participated) return;

            const startX = s.matches[0].x;
            const endX = s.matches[s.matches.length - 1].x;
            const centerX = (startX + endX) / 2;

            const screenX = xScale(centerX)
            const screenY = 20;

            btnG.append("rect")
                .attr("x", screenX - 10)
                .attr("y", screenY)
                .attr("width", 24)
                .attr("height", 20)
                .attr("rx", 4)
                .attr("class", "season-btn")
                .attr("fill", "transparent")
                .attr("stroke", "rgba(184, 254, 176, 0.5)")
                .on("mouseover", function(){
                    d3.select(this).attr("fill", "rgba(184, 254, 176, 0.2)");
                })
                .on("mouseout", function(){
                    d3.select(this).attr("fill", "transparent");
                })
                .on("click", function(){
                    d3.selectAll("rect").attr("fill", "transparent");
                    stretchZoom(s.matches);
                    const event = new CustomEvent("B: season-select", {
                      detail: s.season,
                      bubbles: true,
                      composed: true
                    });
                    this.ownerSVGElement.dispatchEvent(event);
                })
        
            btnG.append("text")
                .attr("x", screenX + 2)
                .attr("y", screenY + 14)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("fill", "rgba(184, 254, 176)")
                .text(`S${s.season + 1}`)
                .style("pointer-events", "none");
        })
    }


    renderButtons();

    function stretchZoom(matches){
        if (matches) {

            const newMinX = matches[0].x;
            const newMaxX = matches[matches.length -1].x;
        

            xScale.domain([newMinX, newMaxX]);
            
            const tickXs = matches.map(m => m.x);

            xAxis
              .scale(xScale)
              .tickValues(tickXs)
              .tickFormat(x => {
                  const m = matches.find(m => m.x === x);
                  return m ? m.matchOfSeason + 1 : "";
              });

            svg.select(".x-axis")
                .call(xAxis)
                .selectAll("text")
                .transition()
                .duration(300)
                .ease(d3.easeCubicOut)
                .attr("display", "block");
            
            areaMaker.y1(d=> yScale(d.score))

            svg.selectAll(".season-area")
                .call(areaMaker)
            

            svg.selectAll(".bridge-line").attr("stroke", "none")

        } else {
            xScale.domain([0, lastx]);
            svg.selectAll(".season-area")
                .attr("pointer-events", "auto")

            xAxis.tickValues(d3.range(0, lastx +1));
            svg.selectAll(".x-axis")
                .transition()
                .duration(300)
                .ease(d3.easeCubicOut)
                .call(xAxis)
                .selectAll("text")
                .attr("display", "none");

            svg.selectAll(".bridge-line").attr("stroke", color)

            areaMaker.y1(yScale(maxScore + hPadding))

            svg.selectAll(".season-area")
                .call(areaMaker)
        }


        svg.selectAll(".season-line")
            .transition()
            .duration(300)
            .ease(d3.easeCubicOut)
            .attr("d", d=> dMakerFunc(d.matches))

        svg.selectAll(".bridge-area")
            .transition()
            .duration(300)
            .ease(d3.easeCubicOut)
            .attr("d", d=> bridgeArea(d))

        svg.selectAll(".season-area")
            .transition()
            .duration(300)
            .ease(d3.easeCubicOut)
            .attr("d", d=> areaMaker(d))
        
        
        svg.selectAll(".bridge-line")
            .transition()
            .duration(300)
            .attr("x1", d => xScale(d.x1))
            .attr("y1", d => yScale(d.y1))
            .attr("x2", d => xScale(d.x2))
            .attr("y2", d => yScale(d.y2))
    }


    host.addEventListener("B: all-seasons", () =>{
        stretchZoom();
    })
}

function cleanData(results){
    console.log(results);
    let offset = 0;
    const seasons = results.map((seasonData, index) => {
        let matches = [];
        if (!seasonData.participated){
            for (let i = 0; i < 7; i++){
                matches.push({
                    x: offset + i + 1,
                    score: 0
                })
            }
            offset += 7;
        } else {
            for (let j = 0; j < seasonData.scores.length; j++) {
                matches.push({
                    x: offset + j + 1,
                    score: seasonData.scores[j].leagueScores,
                    matchOfSeason: j
                });
            }

            offset += seasonData.scores.length;
        }

        return{season: seasonData.season, matches}
    });
    console.log(seasons);
    return seasons;

}
