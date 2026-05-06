
/* 
    <terminal-prompt 
        text-array='["Hej 1","Det här är sentence 2","Och sentence 3"]'
        input-on-arrInx='[2,3]'
    ></terminal-prompt>
*/

class TerminalPrompt extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.service();
    }

    style() {
        return `
            .terminal {

            }
            
            .userInput {
                backgroundColor: rgb(58, 57, 57);
            }
                
            .userInput {
                outline: none;
                display: inline-block;
                min-width: 10px;
            }

            .cursor {
                display: inline-block;
                margin-left: 2px;
            }
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${this.style()}</style>
            <div class="terminal">
                <div class="terminal-output"></div>
                <div class="terminal-input"></div>
            </div>
        `;
    }

    service() {

        const raw = this.getAttribute("text-array");
        const textArr = raw ? JSON.parse(raw) : [];
        const inputIndexes = this.getAttribute("input-on-arrInx");
        const outputElem = this.shadowRoot.querySelector(".terminal-output");

        let index = 0;

        // Print sentences
        const nextSentence = () => {

            if (index >= textArr.length) return;

            const sentence = textArr[index];

            const p = document.createElement("p");
            outputElem.appendChild(p);

            this.typeText(sentence, p, 40);

            const totalTime = sentence.length * 40 + 300;

            setTimeout(() => {

                // Open input if the sentence inx matches
                if (inputIndexes.includes(index)) {
                    this.showInputField();
                }

                index++;
                nextSentence();

            }, totalTime);
        };

        nextSentence();

    }

    typeText(text, element, speed = 80) {
        let i = 0;

        const interval = setInterval(() => {
            element.textContent += text[i];
            i++;

            if (i >= text.length) {
                clearInterval(interval);
            }
        }, speed);
    }

    showInputField() {

        const inputContainer = this.shadowRoot.querySelector(".terminal-input");

        inputContainer.innerHTML = `
            <span class="prompt">></span>
            <span class="userInput" contenteditable="true"></span>
            <span class="cursor">|</span>
        `;

        this.startCursorBlink();

    }

    startCursorBlink() {
        const cursor = this.shadowRoot.querySelector(".cursor");

        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
        }, 500);
    }

}

customElements.define("terminal-prompt", TerminalPrompt);
