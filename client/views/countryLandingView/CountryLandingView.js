
import "./components/CountryLandscape.js";
import "../LandingView/components/TerminalPrompt.js"

export class CountryLandingView {

    constructor() {
        this.app = document.querySelector("#app");
        this.render();
    }


    render() {
        this.app.innerHTML = `
            <country-landing></country-landing>
        `
    }


}
