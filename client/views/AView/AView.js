import "./components/GraphViz.js";
import "./components/CountrySide.js";
import { countriesView } from "../countryLandingView/countryLandingView.js";

class AView {

    constructor() {
        this.app = document.querySelector("#app");

        window.addEventListener("selected-country", (event) => {
            this.render();

            let graphVizComp = this.app.querySelector("graph-viz");
            let countrySideComp = this.app.querySelector("country-side");

            graphVizComp.getParticipantsScoreByLocation(event.detail.id);
            countrySideComp.windowDetails(event.detail)

            document.querySelector("#bckButton").addEventListener("click", () => {
                countriesView.render();
            })

        })

    }


    render() {
        this.app.innerHTML = `

            <style>
                #A1View {
                    display: flex;
                    position: relative;
                    height: 100vh;
                    justify-content: center;
                    align-items: center;
                    gap: 100px;
                }   

               country-side, graph-viz {
                    width: 500px;   
                    height: 700px;
                }
                
                graph-viz {
                    animation: moveIn 2s ease-in;
                }

                @keyframes moveIn {
                    from {
                        transform: translateX(100%);
                    }

                    to {
                        transform: translateX(0%);
                    }
                }

                #bckButton {

                    position: absolute;
                    top: 50px;
                    left: 100px;
                    background-color: transparent;
                    font-size: 32px;
                    width: 40px;
                    height: 40px;
                    color: rgba(184, 254, 176);
                    cursor: pointer;
                    text-align: center;
                    border-radius: 4px;
                }

                #bckButton:hover{
                    background-color: rgba(184, 254, 176, 0.2);
                    border: 0.5px solid rgba(184, 254, 176, 0.5);
                }

               
            </style>

            <div id="A1View">
                <div id="bckButton">&#8592;</div>
                <country-side></country-side>
                <graph-viz></graph-viz>
            </div>
        `
    }


}

new AView();