//VIEWS
import "./views/countryLandingView/countryLandingView.js";

import "./views/AView/AView.js";

import { BView } from"./views/B-View/BView.js"

window.addEventListener("selected-agent", (data) =>{
    const app = document.querySelector("#app");
    app.appendChild(new BView(data.detail.participantId))

})


//TestView för BarChart just nu.
//import "./views/test/testView.js"
