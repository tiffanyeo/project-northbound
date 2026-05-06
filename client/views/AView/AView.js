import "./components/A1.js";

class AView {

    constructor() {
        this.app = document.querySelector("#app");
        this.render();
    }


    render() {
        this.app.innerHTML = `
            <a1-comp></a1-comp>
        `
    }


}

new AView();