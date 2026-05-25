//VIEWS
import "./views/countryLandingView/countryLandingView.js";
import "./views/AView/AView.js";
import "./views/CView/CView.js"

import { BView } from "./views/B-View/BView.js"
import { CView } from "./views/CView/CView.js"

// B-View (performance)
window.addEventListener("selected-agent", (data) => {
    const app = document.querySelector("#app");
    app.appendChild(new BView(data.detail.participantId))

})

// C-View (skills)
window.addEventListener("selected-country", (data) => {
    console.log(data)
    const app = document.querySelector("#app");
    const el = document.createElement("c-view");
el.setAttribute("locationView", data.detail.id);
app.appendChild(el);

    console.log("CREATE C-VIEW WITH ID:", data.detail.id)
    console.log("CREATE THIS ELEM:", ` <c-view locationView=${data.detail.id}></c-view>`)
    //app.appendChild(`<c-view locationView=${data.detail.id}></c-view>`)
    console.log("CREATED")
})

//TestView för BarChart just nu.
//import "./views/test/testView.js"
