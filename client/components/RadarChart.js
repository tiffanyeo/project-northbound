
/*
    let heightWidth = {
        hSvg: 250,
        wSvg: 250,
        hPadding: 50,
        wPadding: 50,
    }
        
    let data = {
        max: 100,
        min: 0,
        axes: [
            {
                label: "Speed",
                value: 99
            },
            {
                label: "Accuracy",
                value: 6
            }
        ],
        title: "ØreByte",
        color: "#3EB51C" || null,
        participantId: "122" || null,
        category: "skills" || null,
        categoryId: "2" || null,
    }
        
    // CREATE
    const radarChart = document.createElement("radar-chart");
    radarChart.data = data;
    radarChart.heightWidth = heightWidth;
    parent.appendChild(radarChart);
    
    // READ
    const radarChart = document.querySelector("radar-chart");
    console.log(radarChart.participantId);
    - 122
    
*/

export class RadarChart extends HTMLElement {

    constructor(heightWidth, data) {
        super();
        this.attachShadow({ mode: "open" });
        this.heightWidth = heightWidth;
        this.data = data;
    }

    connectedCallback() {
        this.render();
        this.setAttributes()
        this.d3Logic();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <svg
                id="radarchart"
                width="${this.heightWidth.wSvg}"
                height="${this.heightWidth.hSvg}"
            ></svg>
        `;
    }

    // readable data
    setAttributes() {
        this.participantId = this.data.participantId || null;
        this.category = this.data.category || null;
        this.categoryId = this.data.categoryId || null;
        this.setAttribute("participantId", this.participantId || "");
        this.setAttribute("category", this.category || "");
        this.setAttribute("categoryId", this.categoryId || "");
    }

    // normalize each axis value (0–1)
    normalizeData() {

        const { min, max } = this.data;
        const normalizedAxes = [];

        this.data.axes.forEach(currAxis => {
            const normalizedValue = (currAxis.value - min) / (max - min);
            normalizedAxes.push({
                label: currAxis.label,
                value: normalizedValue
            });
        });

        return normalizedAxes;
    }

    // convert polar coords (angle + radius) to (x, y)
    convertAngles(angle, radius, cx, cy) {
        const x = cx + radius * Math.sin(angle);
        const y = cy - radius * Math.cos(angle);
        return { x, y };
    }

    // build svg path string from array of points
    buildPath(points) {

        let path = "";
        points.forEach((currPoint, currIndex) => {
            if (currIndex === 0) {
                path += `M${currPoint.x},${currPoint.y} `;
            } else {
                path += `L${currPoint.x},${currPoint.y} `;
            }
        });

        path += "Z";
        return path;

    }

    // initialize logic
    d3Logic() {

        const svg = d3.select(this.shadowRoot.querySelector("#radarchart"));
        const { hSvg, wSvg, hPadding, wPadding } = this.heightWidth;
        const color = this.data.color || "#3EB51C";
        const title = this.data.title || "TITLE";

        // center point of the chart
        const cx = wSvg / 2;
        const cy = (hSvg / 2);

        // max radius accounting for padding
        const maxRadius = Math.min(wSvg - wPadding * 2, hSvg - hPadding * 2) / 2;

        const normalizedAxes = this.normalizeData();
        const numAxes = normalizedAxes.length;

        // angle between each axis spoke
        const angleSlice = (2 * Math.PI) / numAxes;

        // DRAW BACKGROUND GRID RINGS
        const gridLevels = 5;
        for (let currLevel = 1; currLevel <= gridLevels; currLevel++) {

            const currRadius = (currLevel / gridLevels) * maxRadius;
            const currRingPoints = [];

            normalizedAxes.forEach((currAxis, currIndex) => {
                const currAngle = angleSlice * currIndex;
                const currPoint = this.convertAngles(currAngle, currRadius, cx, cy);
                currRingPoints.push(currPoint);
            });

            const currRingPath = this.buildPath(currRingPoints);

            svg.append("path")
                .attr("d", currRingPath)
                .attr("fill", "none")
                .attr("stroke", "#ccddc7")
                .attr("stroke-width", 0.8)
                .attr("stroke-dasharray", "3,3");
        }

        // DRAW AXIS SPOKES (center -> tip) AND LABELS
        normalizedAxes.forEach((currAxis, currIndex) => {

            const currAngle = angleSlice * currIndex;
            const currOuterPoint = this.convertAngles(currAngle, maxRadius, cx, cy);

            // spoke
            svg.append("line")
                .attr("x1", cx)
                .attr("y1", cy)
                .attr("x2", currOuterPoint.x)
                .attr("y2", currOuterPoint.y)
                .attr("stroke", "#cccccc")
                .attr("stroke-width", 0.8);

            // label
            const currLabelPos = this.convertAngles(currAngle, maxRadius + 20, cx, cy);
            svg.append("text")
                .attr("x", currLabelPos.x)
                .attr("y", currLabelPos.y)
                .attr("text-anchor", "middle")
                .attr("font-size", "14px")
                .attr("font-family", "monospace")
                .attr("fill", "#cccccc")
                .text(currAxis.label);

        });

        // DRAW DATA POLYGON
        const dataPoints = [];
        // calc each data point position based on its normalized value
        normalizedAxes.forEach((currAxis, currIndex) => {
            const currAngle = angleSlice * currIndex;
            const currRadius = currAxis.value * maxRadius;
            const currPoint = this.convertAngles(currAngle, currRadius, cx, cy);
            dataPoints.push(currPoint);
        });

        const dataPath = this.buildPath(dataPoints);

        // filled area
        svg.append("path")
            .attr("d", dataPath)
            .attr("fill", color)
            .attr("fill-opacity", 0.25)
            .attr("stroke", color)
            .attr("stroke-width", 2);

        // dot at each data point vertex
        dataPoints.forEach(currPoint => {
            svg.append("circle")
                .attr("cx", currPoint.x)
                .attr("cy", currPoint.y)
                .attr("r", 4)
                .attr("fill", color);
        });

        // ADD TITLE
        svg.append("text")
            .attr("x", cx)
            .attr("y", hSvg - 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("font-family", "monospace")
            .attr("font-weight", "bold")
            .attr("fill", color)
            .text(title);
    }

}

customElements.define("radar-chart", RadarChart);