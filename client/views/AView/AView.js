import "./components/GraphViz.js";
import "./components/CountrySide.js";

class AView {

    constructor() {
        this.app = document.querySelector("#app");

        window.addEventListener("selected-country", (event) => {
            this.render();

            let graphVizComp = this.app.querySelector("graph-viz");
            let countrySideComp = this.app.querySelector("country-side");
            console.log(event)
            graphVizComp.getParticipantsScoreByLocation(event.detail.id);
            countrySideComp.windowDetails(event.detail)

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
                    gap: 200px;
                }   

               country-side, graph-viz {
                    width: 400px;   
                    height: 600px;
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

               
            </style>

            <div id="A1View">
                <country-side></country-side>
                <graph-viz></graph-viz>
            </div>
        `
    }


}

new AView();