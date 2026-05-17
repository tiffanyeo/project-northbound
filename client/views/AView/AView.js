import "./components/GraphViz.js";
import "./components/CountrySide.js";

class AView {

    constructor() {
        this.app = document.querySelector("#app");

        window.addEventListener("selected-country", (event) => {
            this.render();

            let graphVizComp = this.app.querySelector("graph-viz");
            let countrySideComp = this.app.querySelector("country-side");

            graphVizComp.getParticipantsScoreByLocation(event.detail.id);
            countrySideComp.d3Logic(event.detail.path);

        })
    }


    render() {
        this.app.innerHTML = `

            <style>
                #A1View {
                    display: flex;
                    
                    
                    justify-content: center;
                    align-items: center;    
                    gap:100px;
                }

                country-side, graph-viz{
                    width: 100%;
                    height: 100%;
                }

             
               
            </style>

            <div id="A1View">
                <country-side></country-side>
                <graph-viz></graph-viz>
            </div>
        `
    }


}

new AView();