//VIEWS
import "./views/countryLandingView/countryLandingView.js";
import "./views/AView/AView.js";
import "./views/CView/CView.js"
import "./views/LandingView/components/OutroPrompt.js"
import { BView } from "./views/B-View/BView.js"

// B-View (performance)
window.addEventListener("selected-agent", (data) => {
    const app = document.querySelector("#app");
    app.appendChild(new BView(data.detail.participantId))
})

// C-View (skills)
window.addEventListener("selected-country", (data) => {
    const app = document.querySelector("#app");
    const cview = document.createElement("c-view");
    cview.setAttribute("locationView", data.detail.id);
    app.appendChild(cview);

    // OUTRO (report)
    const outroTerminal = document.createElement("outro-terminal-prompt");
    app.appendChild(outroTerminal);
})
