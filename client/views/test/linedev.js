//Creating linechart
const container = document.querySelector("#line");

let offset = 0;

const seasons = data.map(season => {
    const matches = season.matches.map((m, i) => ({
        x: offset + i + 1,
        points: m.points
    }))
    offset += season.matches.length;
    return {season: season.season, matches};
});

let lastSeason = seasons[seasons.length - 1];
let lastx = lastSeason.matches[lastSeason.matches.length - 1].x


const hSvg = 400;
const wSvg = 800;
const wPadding = 80;
const hPadding = 50;

const hViz = hSvg - hPadding * 2;
const wViz = wSvg - wPadding * 2;

const xScale = d3.scaleLinear([0, lastx], [wPadding, wViz + wPadding]);
const yScale = d3.scaleLinear([15, 0], [hPadding, hViz + hPadding]);

const xAxis = d3.axisBottom(xScale)
                .tickValues(d3.range(0, lastx + 1));
const yAxis = d3.axisLeft(yScale)
                .tickValues([1, 3, 6, 10, 15]);

let dMakerFunc = d3.line()
                    .x(d=> xScale(d.x))
                    .y(d => yScale(d.points));

let areaMaker = d3.area()
                    .x(d => xScale(d.x))
                    .y0(yScale(0))
                    .y1(d => yScale(d.points))

const svg = d3.select(container);

svg.append("g")
    .attr("transform", `translate(${wPadding}, 0)`)
    .call(yAxis)
    .selectAll("text")
    .attr("font-size", "12px")
    .attr("font-family", "monospace");

svg.append("g")
    .attr("transform", `translate(0, ${hPadding + hViz})`)
    .call(xAxis)
    .selectAll("text")
    .attr("display", "none")

svg.selectAll(".season-line")
    .data(seasons)
    .enter()
    .append("path")
    .attr("class", "season-line")
    .attr("d", d => dMakerFunc(d.matches))
    .attr("fill", "none")
    .attr("stroke", "#33CE96")
    .attr("stroke-width", 2);

for (let i = 0; i < seasons.length - 1; i++) {
  const end = seasons[i].matches[seasons[i].matches.length - 1];
  const start = seasons[i+1].matches[0];

  svg.append("line")
    .attr("x1", xScale(end.x))
    .attr("y1", yScale(end.points))
    .attr("x2", xScale(start.x))
    .attr("y2", yScale(start.points))
    .attr("stroke", "#33CE96");
}

svg.append("line")
  .attr("x1", xScale(0))
  .attr("y1", yScale(0))
  .attr("x2", xScale(1))
  .attr("y2", yScale(seasons[0].matches[0].points))
  .attr("stroke", "#33CE96");

seasons.forEach((s, sindex) => {
    svg.append("path")
        .datum(s.matches)
        .attr("class", "area")
        .attr("id", `S${sindex + 1}` )
        .attr("fill", "transparent")
        .attr("d", areaMaker)
        .on("mouseover", function(){
            d3.select(this).attr("fill", "#33ce956d");
        })
        .on("mouseout", function(){
            d3.select(this).attr("fill", "transparent")
        })
});







