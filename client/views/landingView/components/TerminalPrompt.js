import "../../countryLandingView/components/CountryLandscape.js"

/*
    <terminal-prompt></terminal-prompt>
*/

class TerminalPrompt extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.step = "first";
    }

    connectedCallback() {
        this.loadText();
        this.render();
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
                color: #39ff14;
                font-family: monospace;
                font-size: 18px;
                line-height: 1.7;
                padding: 60px 80px;
                width: 700px;
                max-width: 90vw;
                min-height: 80vh;
                overflow-y: auto;
                box-sizing: border-box;
                border: 1px solid rgba(57, 255, 20, 0.4);
                border-radius: 8px;
                box-shadow:
                    0 0 40px rgba(57, 255, 20, 0.2),
                    inset 0 0 30px rgba(57, 255, 20, 0.05);
            }
            .line {
                margin-bottom: 4px;
            }
            .input-line {
                display: flex;
                margin-top: 8px;
            }
            .cursor {
                width: 10px;
                height: 18px;
                background: #39ff14;
                margin-left: 4px;
                animation: blink 0.7s infinite;
                box-shadow: 0 0 8px #39ff14;
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
            <div class="terminal">
                <div class="output"></div>
                <div class="input"></div>
            </div>
        `;
    }

    loadText() {

        this.lines = [
            "Connecting to secure network...",
            "Authentication successful.",
            "",
            "Welcome to Project Northbound.",
            "",
            "A - Learn more about Project Northbound",
            "B - Load map"
        ];

        this.moreLines = [
            "",
            "[ PROJECT NORTHBOUND — CLASSIFIED ]",
            "",
            "In 2031, the Nordic states initiated a joint",
            "program to develop the next generation AI model.",
            "",
            "Five nations. Five laboratories. One winner.",
            "",
            "Each nation has recruited a team of AI agents —",
            "specialized in different areas of machine learning.",
            "They are trained by world-leading trainers and",
            "evaluated continuously in standardized tests",
            "referred to as 'seasons'.",
            "",
            "Criteria: precision, speed, adaptability",
            "and stability under extreme load.",
            "",
            "The winning nation delivers their model to",
            "the Nordic Council — and makes history.",
            "",
            "Current season: 7",
            "Active agents: 312",
            "Completed tests: 4 891",
            "",
            "B - Load map"
        ];

    }

    // Print one line to output
    printLine(text) {
        const out = this.shadowRoot.querySelector(".output");
        const line = document.createElement("div");
        line.className = "line";
        line.textContent = text;
        out.appendChild(line);
    }

    // Print array of lines, call done() when finished
    printLines(lines, done) {
        let i = 0;

        const next = () => {
            if (i >= lines.length) {
                done();
                return;
            }
            this.printLine(lines[i]);
            i++;
            setTimeout(next, 250);
        };

        next();
    }

    // Show input field and listen for keydown
    showInput() {
        const inputDiv = this.shadowRoot.querySelector(".input");
        inputDiv.innerHTML = "";

        const wrapper = document.createElement("div");
        wrapper.className = "input-line";

        const input = document.createElement("span");
        const cursor = document.createElement("span");
        cursor.className = "cursor";

        wrapper.appendChild(input);
        wrapper.appendChild(cursor);
        inputDiv.appendChild(wrapper);

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

    // Handle input based on current step
    handleInput(value) {
        const key = value.toUpperCase();

        // First choice — A or B
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

        // Second choice — only B
        else if (this.step === "second") {
            if (key === "B") {
                this.loadMap();
            } else {
                this.printLine("Invalid input. Press B to load map.");
                this.showInput();
            }
        }
    }

    // Load map and fade out terminal
    loadMap() {
        document.removeEventListener("keydown", this.keyHandler);

        const loadLines = [
            "",
            "Initializing map...",
            "Loading agent data...",
            "Establishing secure connection...",
            "Done."
        ];

        this.printLines(loadLines, () => {
            // Append map
            const target = document.createElement("country-landing");
            document.body.appendChild(target);

            // Wait for map animations then fade out
            setTimeout(() => {
                const terminal = this.shadowRoot.querySelector(".terminal");
                terminal.style.transition = "opacity 1s ease";
                terminal.style.opacity = "0";
                setTimeout(() => this.remove(), 600);
            }, 3500);
        });
    }
}

customElements.define("terminal-prompt", TerminalPrompt);