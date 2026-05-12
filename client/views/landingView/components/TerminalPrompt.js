
/* 
    <terminal-prompt 
        text-array='["Hej 1","Hej 2","Välj A eller B","Du valde A","Du valde B"]'
        input-on-arrInx='[2]'
        fallouts='{
            "2": { "A": 3, "B": 4 }
        }'
    ></terminal-prompt>
*/

class TerminalPrompt extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.textArr = [];
        this.inputSteps = {};
        this.currentIndex = 0;
    }

    connectedCallback() {
        this.textArr = JSON.parse(this.getAttribute("text-array") || "[]");
        this.inputSteps = JSON.parse(this.getAttribute("input-steps") || "{}");

        this.render();
        this.run();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .terminal {
                    background: black;
                    color: #00ff00;
                    font-family: monospace;
                    padding: 10px;
                    min-height: 200px;
                }

                .line {
                    margin-bottom: 6px;
                }

                .input-line {
                    display: flex;
                }

                .cursor {
                    width: 8px;
                    background: #00ff00;
                    margin-left: 4px;
                    animation: blink 0.7s infinite;
                }

                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0; }
                    100% { opacity: 1; }
                }
            </style>

            <div class="terminal">
                <div class="output"></div>
                <div class="input"></div>
            </div>
        `;
    }

    async run() {
        while (this.currentIndex < this.textArr.length) {
            const line = this.textArr[this.currentIndex];

            await this.typeLine(line);

            // Om detta index kräver input
            if (this.inputSteps[this.currentIndex]) {
                const userInput = await this.waitForInput();
                this.printUserInput(userInput);

                const step = this.inputSteps[this.currentIndex];

                // Om input matchar ett definierat svar
                if (step[userInput]) {
                    const output = step[userInput];

                    // Om output är en array → lägg till flera meningar
                    if (Array.isArray(output)) {
                        this.textArr.push(...output);
                    } else {
                        this.textArr.push(output);
                    }

                } else {
                    this.textArr.push("Jag förstod inte. Försök igen.");
                }
            }

            this.currentIndex++;
        }
    }

    typeLine(text) {
        return new Promise(resolve => {
            const out = this.shadowRoot.querySelector(".output");
            const line = document.createElement("div");
            line.className = "line";
            out.appendChild(line);

            let i = 0;
            const interval = setInterval(() => {
                line.textContent += text[i];
                i++;

                if (i >= text.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, 35);
        });
    }

    waitForInput() {
        return new Promise(resolve => {
            const inputDiv = this.shadowRoot.querySelector(".input");
            inputDiv.innerHTML = "";

            const wrapper = document.createElement("div");
            wrapper.className = "input-line";

            const input = document.createElement("span");
            input.textContent = "";

            const cursor = document.createElement("span");
            cursor.className = "cursor";

            wrapper.appendChild(input);
            wrapper.appendChild(cursor);
            inputDiv.appendChild(wrapper);

            const keyHandler = (e) => {
                if (e.key === "Enter") {
                    document.removeEventListener("keydown", keyHandler);
                    inputDiv.innerHTML = "";
                    resolve(input.textContent.trim());
                } else if (e.key === "Backspace") {
                    input.textContent = input.textContent.slice(0, -1);
                } else if (e.key.length === 1) {
                    input.textContent += e.key;
                }
            };

            document.addEventListener("keydown", keyHandler);
        });
    }

    printUserInput(input) {
        const out = this.shadowRoot.querySelector(".output");
        const line = document.createElement("div");
        line.className = "line";
        line.textContent = "> " + input;
        out.appendChild(line);
    }
}

customElements.define("terminal-prompt", TerminalPrompt);
