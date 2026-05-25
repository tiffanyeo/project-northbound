

import { Agents } from "../../../services/Agents/Agents.js";
import { DB } from "../../../services/DBAccess.js"

/*
    <outro-terminal-prompt></outro-terminal-prompt>
*/

class OutroTerminalPrompt extends HTMLElement {

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
    }

    style() {
        return `
            :host {
                position: relative; 
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh; 
            }
                
            .terminal {
                background: #0D1A2E;
                color: #34D399;
                font-family: monospace;
                font-size: 18px;
                line-height: 1.7;
                padding: 60px 80px;
                padding-bottom: 180px;
                width: 800px;
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
                margin-top: 100px;
                text-align: left; 
                padding-top: 0px;
                color: #34D399;
                padding-bottom: 50px;
                width: 100%
            }
            
            .line {
                margin-bottom: 4px;
            }
                
            .input-line {
                display: flex;
                margin-top: 8px;
            }
                
            .start-btn {
                background: transparent;
                border: none;
                border-bottom: 1px solid #34D399;
                color: #34D399;
                padding: 6px 14px;
                font-family: monospace;
                cursor: pointer;
                margin-bottom: 30px;
                transition: 0.2s;
            }

            .start-btn:hover {
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
        // 0: Object { participantId: 154, name: "ØreByte", skillFactor: 74 }
        /*         const agentTop = Agents.getAgentsAverage();
                console.log("TOP 5 AGENTS (best average skill-factors, across all skill-factors)", agentTop)
                const skills = agentTop.map(currAgent => Agents.getAllSkillFactors(currAgent.participantId))
                console.log("TOP 5 AGENTS SKILL-FACTORS", skills)
                console.log("AGENTS LOCATIONS", agentTop.map(
                    currAgent => DB.participants.find(
                        currP => currP.id === currAgent.participantId)))
                console.log("ALL LOCATIONS:", DB.locations)
                console.log("ALL DICIPLINES", DB.disciplines)
                console.log("ALL REQUIRED SKILLFACTORS IN EACH DISIPLINE", DB.disciplines.map(currDisc => currDisc.skillFactors)) */

        this.shadowRoot.innerHTML = `
            <style>${this.style()}</style>
            <div class="wrapper">
                <h1 class="title">FINAL REPORT</h1>
                <button class="start-btn">RUN REPORT</button>
                <div class="terminal">
                    <div class="output"></div>
                    <div class="input"></div>
                </div>
            </div>
        `;
    }
    
    eListeners() {
        const runBtn = this.shadowRoot.querySelector(".start-btn")
        runBtn.addEventListener("click", () => {
            this.shadowRoot.querySelector(".start-btn").remove();
            this.initTerminal();
        });
    }
    
    loadText() {

        this.lines = [
            "[ PROJECT: NORTHBOUND 2031 ]",
            "",
            "The 2031 evaluation cycle is complete. All Nordic sovereign agents have been tested across every discipline.",
            "",
            "",
            "One model achieved the strongest overall alignment with Nordic operational needs:",
            "",
            "→ ØreByte — Denmark",
            "",
            "",
            "Press A to view the top 5 agents and their projected future performance."
        ];

        this.moreLines = [
            "[ MOST PROMISING AGENTS — NEXT PROCUREMENT CYCLE ]",
            "",
            "The following agents show the strongest potential for future Nordic deployment.",
            "Based on skill‑factor averages (avr. s.f), alignment with Nordic priority and performing stable scores across the test cycles.",
            "",
            "-",
            "1. ØreByte — Denmark (74 avr. s.f)",
            "Selected as the top candidate.",
            "Although tied with Wulkaino in total score, ØreByte exceeds Nordic priority metrics in Accuracy and Intelligence.",
            "",
            "",
            "2. Wulkaino — Iceland (74 avr. s.f)",
            "Strong Token Power and high Speed.",
            "Promising for future procurement cycles, but slightly weaker alignment with Nordic priority disciplines compared to ØreByte.",
            "",
            "",
            "3. Viking — Sweden (73 avr. s.f)",
            "Balanced skill‑profile, suggesting strong development potential with the right coaching.",
            "",
            "",
            "4. SpotifAI — Sweden",
            "Exceptionally strong test‑cycle results, surpassing agents with higher skill‑factors.",
            "However, its skill‑profile does not explain these outcomes. NorthBound could not determine whether the high scores reflected capability or statistical variance.",
            "",
            "",
            "5. Fjordén — Norway",
            "Highest average score per event. However, Fjordén is a newer model with fewer completed test cycles, making long‑term stability uncertain.",
            "-",
            "",
            "All five agents are considered promising candidates for future Nordic deployment.",
            "If ØreByte’s license is not renewed, one of these models may be selected for procurement in the next evaluation cycle.",
            "",
            "",
            "[ END OF PUBLIC SUMMARY ]",
            "",
            "Thank you for exploring PROJECT: NorthBound.",
            "",
            "",
            "Responsible publishers:",
            "",
            "Philip Smith - Nordic AI Evaluation Board",
            "",
            "Tiffany Larsson - Office for Sovereign Model Oversight",
            "",
            "Alina Björkén - Scandinavian Digital Integrity Council",
            "",
            "",
            "This concludes the public exploration module.",
            "",
            "[ CONNECTION TERMINATED ]",
        ];

    }

    // START PRINTING
    initTerminal() {
        this.printLines(this.lines, () => this.showInput())
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

        // skip directly
        if (this.cancelPrint) return done();

        let i = 0;
        const printNext = () => {

            // skip directly
            if (this.cancelPrint) return done();
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

        // first step - read more
        if (this.step === "first") {
            if (key === "A") {
                this.step = "second";
                this.printLines(this.moreLines, () => this.showInput());
            } else {
                this.printLine("Invalid input. Try again.");
                this.showInput();
            }
        }

    } 

}

customElements.define("outro-terminal-prompt", OutroTerminalPrompt);