import "./components/CountryLandscape.js";

class CountryLandingView {

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

export const countriesView = new CountryLandingView();