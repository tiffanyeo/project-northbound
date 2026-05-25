import "../../countryLandingView/components/CountryLandscape.js"

/*
    <terminal-prompt></terminal-prompt>
*/

class TerminalPrompt extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.step = "first";
        this.cancelPrint = false;
    }

    connectedCallback() {
        this.loadText();
        this.render();
        this.eListeners()
        this.printLines(this.lines, () => this.showInput());
    }

    style() {
        return `
            :host {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .terminal {
                background: #0D1A2E;
                color: #34D399;
                font-family: monospace;
                font-size: 18px;
                line-height: 1.7;
                padding: 60px 80px;
                padding-bottom: 180px;
                width: 700px;
                max-width: 90vw;

                height: 70vh;
                overflow-y: auto;

                box-sizing: border-box;
                border: 1px solid #34D399;
                border-radius: 8px;
                box-shadow:
                    0 0 40px #34d39966,
                    inset 0 0 30px rgba(57, 255, 20, 0.05);
            }
        
            .wrapper {
                padding: 0 50px;
                width: 100vw;
                display: flex;
                flex-direction: column; 
                justify-content: space-between;
                align-items: center;
            }
            
            .title {
                text-align: left; 
                padding-top: 0px;
                color: #34D399;
                padding-bottom: 100px;
                width: 100%
                }
            
            .line {
                margin-bottom: 4px;
            }
            .input-line {
                display: flex;
                margin-top: 8px;
            }
                
            .skip-btn {
                background: transparent;
                border: none;
                border-bottom: 1px solid #34D399;
                color: #34D399;
                padding: 6px 14px;
                font-family: monospace;
                cursor: pointer;
                margin-top: 30px;
                transition: 0.2s;
            }

            .skip-btn:hover {
                background: #34d39964;
                border-radius: 5px;
            }

            .cursor {
                width: 10px;
                height: 18px;
                background: #34D399;
                margin-left: 4px;
                animation: blink 0.7s infinite;
                box-shadow: 0 0 8px #34D399;
            }
            @keyframes blink {
                0% { opacity: 1; }
                50% { opacity: 0; }
                100% { opacity: 1; }
            }
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${this.style()}</style>
            <div class="wrapper">
                <h1 class="title">PROJECT: NorthBound</h1>
                <div class="terminal">
                    <div class="output"></div>
                    <div class="input"></div>
                </div>
                <button class="skip-btn">SKIP</button>
            </div>
        `;
    }

    eListeners() {
        const skipBtn = this.shadowRoot.querySelector(".skip-btn");
        skipBtn.addEventListener("click", () => {
            this.cancelPrint = true;   // <-- STOPPA ALL UTSKRIFT
            this.loadMap();            // <-- LADDAR KARTAN DIREKT
        });
    }
    loadText() {

        this.lines = [
            "SECURE PUBLIC ACCESS NODE ESTABLISHED",
            "",
            "The following data was released under the Nordic Transparency Directive, 2031.",
            "",
            "",
            "Project NorthBound was initiated after growing dependence on foreign AI systems used in defence, surveillance and strategic analysis.",
            "",
            "",
            "The Nordic states commissioned a joint evaluation program to identify a sovereign Scandinavian alternative.",
            "",
            "A - Read briefing",
            "B - Load operational map"
        ];

        this.moreLines = [
            "",
            "[ NORTHBOUND EVALUATION BRIEFING ]",
            "",
            "Project NorthBound evaluates sovereign AI models (agents) developed across the participating Nordic regions.",
            "",
            "Each operational model underwent continuous testing across multiple evaluation seasons.",
            "",
            "",
            "",
            "Testing disciplines included:",
            "",
            "",
            "- Debugging",
            "",
            "- Information disclosure",
            "",
            "- Spread disinformation",
            "",
            "- Analyze data",
            "",
            "- Track digital footprints",
            "",
            "",
            "",
            "Agents were supervised by both trainers and tactical coaches - responsible for optimization, calibration and deployment strategy throughout each test-cycle (called season).",
            "",
            "Performance data was collected after every completed test cycle, and was released through the Nordic Transparency Directive.",
            "",
            "",
            "",
            "The following interface allows public inspection of agents performance, regional development patterns and agents skills.",
            "",
            "",
            "Available datasets include:",
            "",
            "- Regional agent performance",
            "",
            "- Seasonal progression",
            "",
            "- Discipline-specific analysis",
            "",
            "- Regional agent skills",
            "",
            "",
            "Access level: CIVILIAN RESEARCH",
            "",
            "B - Load operational map"
        ];
    }

    // PRINT LINE (one)
    printLine(text) {

        // create sentence elems
        const out = this.shadowRoot.querySelector(".output");
        const line = document.createElement("div");
        line.className = "line";
        out.appendChild(line);

        let i = 0;

        // print each letter
        const nextChar = () => {
            if (this.cancelPrint) return;
            if (i < text.length) {
                // add each letter
                line.textContent += text[i];
                i++;
                setTimeout(nextChar, 30);
            } else {
                // when print done -> auto scroll
                const terminal = this.shadowRoot.querySelector(".terminal");
                terminal.scrollTop = terminal.scrollHeight;
            }
        };

        nextChar();
    }

    // PRINT LINES (arr)
    printLines(lines, done) {

        let i = 0;
        const printNext = () => {
            if (this.cancelPrint) return;
            if (i >= lines.length) return done();

            const text = lines[i];
            this.printLine(text);

            // calc time needed to print current line
            const timePerLetter = 40;
            const pauseAfterLine = 120;
            const lettersInCurrLine = text.length;
            const timeNeeded = (lettersInCurrLine * timePerLetter) + pauseAfterLine;

            i++;
            setTimeout(printNext, timeNeeded);
        };

        printNext();
    }

    // INPUT FIELD + eLISTENER
    showInput() {

        // set input fiels
        const inputDiv = this.shadowRoot.querySelector(".input");
        inputDiv.innerHTML = "";
        const wrapper = document.createElement("div");
        wrapper.className = "input-line";

        // add cursor
        const input = document.createElement("span");
        const cursor = document.createElement("span");
        cursor.className = "cursor";

        wrapper.appendChild(input);
        wrapper.appendChild(cursor);
        inputDiv.appendChild(wrapper);

        // eListener
        this.keyHandler = (e) => {
            if (e.key === "Enter") {
                const value = input.textContent.trim();
                inputDiv.innerHTML = "";
                this.printLine("> " + value);
                this.handleInput(value);
            } else if (e.key === "Backspace") {
                input.textContent = input.textContent.slice(0, -1);
            } else if (e.key.length === 1) {
                input.textContent += e.key;
            }
        };

        document.addEventListener("keydown", this.keyHandler);
    }

    // INPUT HANDELING
    handleInput(value) {

        const key = value.toUpperCase().trim();

        // first step - find input choice (a or b)
        if (this.step === "first") {
            if (key === "A") {
                this.step = "second";
                this.printLines(this.moreLines, () => this.showInput());
            } else if (key === "B") {
                this.loadMap();
            } else {
                this.printLine("Invalid input. Try again.");
                this.showInput();
            }
        }

        // second step - find input choice (only b)
        else if (this.step === "second") {
            if (key === "B") {
                this.loadMap();
            } else {
                this.printLine("Invalid input. Press B to load map.");
                this.showInput();
            }
        }

    }

    // LOAD MAP + DELETE TERMINAL
    loadMap() {

        console.log("LOAD MAP")
        // clear terminal
        const app = document.querySelector("#app");
        document.removeEventListener("keydown", this.keyHandler);

        const loadLines = [
            "",
            "Initializing map...",
            "Loading agent data...",
            "",
            "Establishing secure connection...",
            "Done."
        ];

        // print loading text
        this.printLines(loadLines, () => {

            // append map
            const countryMap = document.createElement("country-landing");
            app.appendChild(countryMap);

            // fade out terminal when loading map
            setTimeout(() => {
                const terminal = this.shadowRoot.querySelector(".terminal");
                terminal.style.transition = "opacity 1s ease";
                terminal.style.opacity = "0";
                setTimeout(() => this.remove(), 600);
            }, 800);

        });

    }

}

customElements.define("terminal-prompt", TerminalPrompt);