import { DB } from "../../../backend/services/DBAccess.js";
import { RadarChart } from "../../components/RadarChart.js";
import createLineChartForAgent from "./components/SectionLine.js"

export class BView extends HTMLElement{
    constructor(agentId, disciplineId = 3){
        super();
        this.attachShadow({mode: "open"});
        this.id = agentId;
        this.color = ""
        this.allSeasons = DB.seasons.length;
        this.disciplineId = disciplineId;
        this.allDisciplines = DB.disciplines;
        this.discipline = this.allDisciplines.find(d=> d.id == this.disciplineId);
        this.discColors = ["#9790ec", "#F06129", "#e3fd40","#C82EF5", "#D3346E"];
        this.skillColors = ["#94D5FD", "#FA9C89", "#B8FEB0","#E6BBFB", "#FF7171"];

        this.lineHw = {
            hSvg: 500,
            wSvg: 800,
            hPadding: 40,
            wPadding: 24
        }
    }
    
    connectedCallback(){
        this.color = DB.participants.find(p=> p.id == this.id).color;
        const gadfd = this.getAgentDataForDiscipline(this.disciplineId);
        this.render();
        this.renderAgent();
        this.renderLineChart();
        this.printRadarData();

        this.eList();        
    }

    getAgentDataForDiscipline(disciplineId){
        let seasonScores = this.getCalculatedScores();
        let results = []
        for(let i = 0; i < this.allSeasons; i++){
            let season = seasonScores[i];
            let eventsOfDiscipline = season.events.filter(event => event.disciplineId == disciplineId);
            let scoresForAgent = eventsOfDiscipline.flatMap(e => e.scores).filter(s=> s.participantId == this.id);

            if (scoresForAgent.length == 0){
                results.push(
                    {
                        season: season.season,
                        participated: false,
                        scores: []
                    }
                )
            } else {
                results.push(
                    {
                        season: season.season,
                        participated: true,
                        scores: scoresForAgent
                    }
                )
            }
        }

        return results;
    }

    getCalculatedScores(){
        let leagueScores = [15, 10, 6, 3, 1, 0];
        let seasonScores = []
        for (let i = 0; i < this.allSeasons; i++){
            let allCompetitionDays = DB.seasons[i].competitionDays;
            let allEvents = allCompetitionDays.flatMap(cd=> cd.events);
            allEvents.forEach(event => {
                event.scores.sort((a,b) => b.score - a.score).forEach((entry, index) => {
                    entry.leagueScores = leagueScores[index];
                });
            })
            seasonScores.push({season: i, events: allEvents})
        }
        
        return seasonScores;
    }



    getSeasonInfo(season){
        const coachId = DB.seasons[season].coaches.filter(p => p.participantId == this.id).map(p => p.coachId);
        let coach;
        let skill;
        if (coachId.length == 0){
            coach = "No coach"
            skill = "-"
        } else {
            coach = DB.coaches.find(c => coachId == c.id);
            skill = DB.skills.find(s => s.id == coach.skillId);
        }

        const trainerId = DB.seasons[season].trainers.filter(p=> p.participantId == this.id).map(p => p.trainerId);
        const trainer = DB.trainers.find(t=> trainerId == t.id);
        const discipline = DB.disciplines.find(d=> d.id == trainer.disciplineId);

        return { coach, skill, trainer, discipline }
    }

    renderLineChart(){
        const results = this.getAgentDataForDiscipline(this.disciplineId);
        
        const lineContainer = this.shadowRoot.querySelector("#chart");
        const btnContainer = this.shadowRoot.querySelector("#btn-container");

        lineContainer.innerHTML = "";
        btnContainer.innerHTML = "";

        createLineChartForAgent(this.lineHw, results, lineContainer, btnContainer, this);
    }

    printSeasonInfo(season = undefined){
        if (!season){
            return `
                <div class="no-info">
                    <p>Debugging &#9662;</p>
                    <h4>Use the dropdown to explore progress in other disciplines</h4>
                    <div>S1</div>
                    <p>Use the buttons to select seasons for more information</p>
                </div>
            `
        } else {
            let seasonNr = Number(season.slice(1));
            let data = this.getSeasonInfo(seasonNr)

            return `
                <div class="info">
                    <h2>Season ${seasonNr + 1}</h2>
                    <p>Trainer: ${data.trainer.name}</p>
                    <p>Trainer-Discipline: <span style="color:${this.discColors[data.discipline.id -1]}">${data.discipline.name}</span></p>
                    <p>Coach: ${data.coach.name}</p>
                    <p>Coach-Skill: <span style="color:${this.skillColors[data.skill.id - 1]}">
                        ${data.skill.name}
                    </span></p>
                </div>
            `
        }
    }
    
    printRadarData(){
        this.shadowRoot.querySelector(".radar").innerHTML = "";
        const hw = {
            hSvg: 300,
            wSvg: 600,
            hPadding: 80,
            wPadding: 80
        }

        const dSkillFactors = DB.disciplines.find(d => d.id == this.disciplineId).skillFactors;

        let axes = [];

        for (let property in dSkillFactors){
            axes.push({label: property, value: dSkillFactors[property]});
        }

        let part = DB.disciplines.find(p => p.id == this.disciplineId);

        let data = {
            axes,
            title: part.name,
            max: 30,
            min: 0,
            color: this.discColors[this.disciplineId -1]
        }

        const radarChart = new RadarChart(hw, data);
        return this.shadowRoot.querySelector(".radar").appendChild(radarChart);
    }

    eList(){
        
        this.addEventListener("B: season-select", (e) => {
            const info = this.shadowRoot.querySelector(".infoCont");
            info.innerHTML = this.printSeasonInfo(`S${e.detail}`);

        })

        //DROPDOWM
        const dropdown = this.shadowRoot.querySelector(".dropdown");
        dropdown.addEventListener("mouseover", () => {
            const dropMenu = this.shadowRoot.querySelector(".dropdown-menu");
            const arrow = this.shadowRoot.querySelector("#arrow");
            arrow.style.rotate = "180deg";
            dropMenu.style.display = "block";
        })

        dropdown.addEventListener("mouseout", () => {
            const dropMenu = this.shadowRoot.querySelector(".dropdown-menu");
            dropMenu.style.display = "none";
            const arrow = this.shadowRoot.querySelector("#arrow");
            arrow.style.rotate = "none";
        })
        this.renderDropdownEList()


        this.shadowRoot.querySelector(".radar").addEventListener("B: discipline-selected", () =>{
            this.renderLineChart();
            this.printRadarData();
            const results = this.getAgentDataForDiscipline(this.disciplineId);
            const lineContainer = this.shadowRoot.querySelector("#chart");
            lineContainer.innerHTML = "";
            const btnContainer = this.shadowRoot.querySelector("#btn-container");
            btnContainer.innerHTML = "";
            createLineChartForAgent(this.lineHw, results, lineContainer, btnContainer, this);
        })

        this.shadowRoot.querySelector("#all-seasons").addEventListener("click", () => {
            const zoomOutEvent = new CustomEvent("B: all-seasons", {
                detail: "zoomOut",
                bubbles: true,
                composed: true
            });
            this.shadowRoot.querySelector("#chart").dispatchEvent(zoomOutEvent);
            this.shadowRoot.querySelector(".infoCont").innerHTML = this.printSeasonInfo();
        })

        this.shadowRoot.querySelector("#backBtn").addEventListener("click", () => {
            this.remove();
        });



    }

    renderDropdownEList(){
        const dropItems = this.shadowRoot.querySelectorAll(".list-item");
        dropItems.forEach(item => item.addEventListener("click", () => {
            this.disciplineId = this.allDisciplines.find(d => d.name == item.textContent).id;
            this.discipline = this.allDisciplines.find(d=> d.id == this.disciplineId);
            const disc = this.shadowRoot.querySelector("#disc")
            disc.innerHTML = item.textContent;
            this.createDropDown();

            const ev = new CustomEvent("B: discipline-selected",{
                    detail: this.disciplineId,
                    bubbles: true,
                    composed: true
            });
            this.shadowRoot.querySelector(".radar").dispatchEvent(ev);
        }))
    }

    createDropDown(){
        const dropMenu = this.shadowRoot.querySelector(".dropdown-menu");
        let divs = ``;
        this.allDisciplines.forEach(d => d.id !== this.disciplineId ? divs +=`<div class="list-item">${d.name}</div>` : "");
        if (!dropMenu){
            return divs;
        } else {
            dropMenu.innerHTML = divs;
            this.renderDropdownEList();
            return
        }
    }

    renderAgent(){
        const agent = DB.participants.find(p => p.id == this.id);
        const div = this.shadowRoot.querySelector(".agent");
        div.innerHTML = agent.name;

    }

    render(){
        this.shadowRoot.innerHTML = `
        <style>

            :host {
                position: absolute;
                inset: 0; 
                z-index: 1000;
                background: #0D1A2E;
            }

            #all{
                margin: 0px auto;
                color: #34D399;
                display: grid;
                grid-template-columns: 2fr 1fr;
                overflow: clip;
                background: #0D1A2E;
            }
            .left{
                margin: 0 auto;
                width: 802px;
                height: min-content;
                display: flex;
                flex-direction: column;
                align-items: center;
                border-radius: 16px;
                overflow: clip;
            }
            .right{
                margin: 0 auto;
                height: min-content;
                width: 350px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
            }
            .info{
                padding: 0px 40px;
                text-indent: 160px hanging each-line;
            }
            .info h2{
                font-weight: normal;
                
            }
            .infoCont {
                height: 188px;
                width: 340px;
                margin-top: 150px;
                text-shadow: 1px 1px 3px rgba(184, 254, 176, 0.5);
            }
            .no-info{
                color: #ccddc7;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
            }
            .no-info h4 {
                font-weight: normal;
            }
            .no-info div {
                width: 28px;
                padding: 2px 0px;
                height: 16px;
                color: #34D399;
                text-align: center;
                border: 0.5px solid rgba(184, 254, 176, 0.5);
                border-radius: 4px;
            }
            .radar{
                text-align: center;
            }

            .agent{
                margin: 32px 0px;
                width: 200px;
                padding: 8px;
                border: 4px solid ${this.color};
                border-radius: 8px;
                color: #ccddc7;
                text-shadow: 1px 0 #0D1A2E, 0 1px #0D1A2E, -1px 0 #0D1A2E, 0 -1px #0D1A2E, 1px 1px 4px ${this.color};
                font-size: 20px;
                font-weight: bold;
                text-align: center;
            }
            .top-menu{
                width: 642px;
                box-shadow: 1px 1px 4px rgba(184, 254, 176, 0.5);
                border-radius: 16px 16px 0 0;
                display: flex;
                align-items: center;
                padding: 1px 80px;
                gap: 20px;
            }

            .dropdown{
                position: relative;
                display: inline-block;

            }
            .dropdown-menu{
                position: absolute;
                width: 210px;
                top: 40px;
                left: -8px;
                background-color: #0D1A2E;
                display: none;
                box-shadow: 1px 3px 2px rgba(184, 254, 176, 0.25);

            }

            .list-item{
                color: white;
                padding: 8px;
                background-color; #0D1A2E;
                cursor: default;
            }

            .list-item:hover{
                color: #34D399;
                text-shadow: 1px 1px 2px rgba(184, 254, 176, 0.5);
            }
            #chart-container{
                padding: 40px 0 80px;
                text-align: center;
            }
            #disc-btn{
                margin: 0;
                position: relative;
                display: flex;
                gap: 8px;
                background: none;
                border: none;
                border-radius: 8px;
                font-family: inherit;
                color: white;
                padding: 0px;

            }
            #disc-btn:hover {
                    color: #34D399;
                    text-shadow: 1px 1px 2px rgba(184, 254, 176, 0.5);
            }
            rect.isClicked{
                fill: #4FE125;
            }
            button{
                margin: 0;
                background-color: transparent;
                width: auto;
                overflow: visible;
                line-height: normal;
                font: inherit;
                padding: 4px 6px;
                color: rgba(184, 254, 176);
                text-align: center;
                border: 0.5px solid rgba(184, 254, 176, 0.5);
                border-radius: 4px;
            }
            button:hover{
                background-color: rgba(184, 254, 176, 0.2);
            }
            .grid{
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                align-items: center;
                justify-content: center;

            }
            #backBtn{
                height: 40px;
                width: 40px;
                font-size: 32px;
                padding-bottom: 4px;
                line-height: 0;
                border: none;
            }
            #backBtn:hover{
                border: 0.5px solid rgba(184, 254, 176, 0.5);
            }

            .ygrid path{
                stroke: none;
            }
            .ygrid line {
                stroke: rgba(184, 254, 176, 0.5);
                opacity: 0.3;
            }

            .tool {
                z-index: 10000;
                position: absolute;
                text-align: left;
                padding: 0px 6px;
                background: rgba(184, 254, 176);
                font-size: 12px;
                color: #0D1A2E;
                border: 1px solid rgba(184, 254, 176, 0.5);
                border-radius: 4px;
                pointer-events: none;
                line-height: 0.2;
            }
        </style>
            <div id="all">
                <div class="left" class="half">
                    <div class="grid">
                        <button id="backBtn">&#8592;</button>
                        <div class="agent"></div>
                    </div>
                    <div class="top-menu">
                        <p class"label">Progress in Discipline:</p>
                        <div class="dropdown">
                            <button id="disc-btn"><p id="disc">${this.discipline.name}</p> <p id="arrow">&#9662;</p></button>
                            <div class="dropdown-menu">
                                ${this.createDropDown()}
                            </div>
                        </div>

                    </div>
                    <div id="chart-container">
                        <svg id="chart" width="800" height="500"></svg>
                        <svg id="btn-container" width="800" height="60"></svg>
                        <button id="all-seasons">All Seasons</button>
                        <div class="tool"></div>
                    </div>
                </div>
                <div class="right">
                    <div class="infoCont">
                    ${this.printSeasonInfo()}
                    </div>
                    <div class="radar">
                    </div>
                </div>
            </div>
        `;
    }   
    
}

customElements.define("b-view", BView);
