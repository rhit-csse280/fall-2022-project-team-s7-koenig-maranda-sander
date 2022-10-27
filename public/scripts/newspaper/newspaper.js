let newspaper = {} || newspaper;


class MadLib {
    constructor (element) {
        this.element = element;
        this.text = element.innerHTML;

        this.processText();

        this.element.innerHTML = this.text;
    }

    processText() {
        const mainSubject = "Charlie"

        this.text = this.text.split('|');
        for(let i = 0;i < this.text.length;i ++) {
            console.log(this.text[i]);
            switch(this.text[i]) {
                case 'main': 
                    this.text[i] = mainSubject;
                    break;
                case 'a':
                    this.text[i] = getRandomWord(adjective);
                    break;
                case 'n':
                    this.text[i] = getRandomWord(noun);
                    break;
                case 'lastname':
                    this.text[i] = getRandomWord(title);
            }
        }
        this.text = this.rebuildString(this.text);
    }

    rebuildString(arrayOfStrings) {
        let str = '';
        arrayOfStrings.forEach(s => {
            str += s;
        });
        return str;
    }
}

function main() {
    const article = document.getElementById("newspaperArticle");
    const articleBlock = new MadLib(article);
}

main();