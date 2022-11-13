const newspaper = {} || newspaper;
// newspaper.password = String(Math.floor(Math.random() * 26 + 1)) + '|' + String(Math.floor(Math.random() * 10 + 9));
newspaper.alphabet = 'abcdefghijklmnopqrstuvwxyz';

newspaper.Newspaper = class {
    constructor(password) {
        this.password = password.split('|');

        this.boldIndex = parseInt(this.password[0]);
        this.examinedLetter;

        this.handleArticle();
        this.handleAdd();

        this.handleColumn();

        // console.log('newspaper.password :>> ', newspaper.password);
    }

    handleArticle() {
        const article = document.querySelector('#article');
        let txt = article.innerHTML;
        txt = txt.split(' ');
        let newTxt = '';
        let currentIndex = 0;
        txt.forEach(word => {
            let newWord = word;
            if (word[0] == '[') {                
                currentIndex ++;
                if (currentIndex == this.boldIndex) {
                    this.examinedLetter = word[1].toUpperCase();
                }
                word = '<strong>' + word.replace('[', '') + '</strong> '
            }
            newTxt += word + ' ';
        });
        article.innerHTML = newTxt;
    }

    handleColumn() {
        const columnText = document.querySelector('#column > p');
        let workingText = columnText.innerText.split('[the');
        let initialThes = workingText.length - 1;
        let maxThes = initialThes * 2;

        let myNumThes = newspaper.password.split('|')[1];

        console.log('initialThes :>> ', initialThes);
        console.log('maxThes :>> ', maxThes);
        console.log('myNumThes :>> ', myNumThes);

        let openSlots = [];
        for (let i = 0;i < initialThes;i ++) {
            openSlots.push(i);
        }

        let chosenSlots = [];
        for (let i = 0;i < myNumThes - initialThes;i ++) {
            let poppedItem = openSlots.pop(Math.floor(Math.random() * openSlots.length));
            chosenSlots.push(poppedItem);
        }

        let newInnerText = "";
        for (let i = 0;i < workingText.length;i ++) {
            newInnerText += workingText[i];
            if (i == workingText.length - 1) {
                continue;
            }
            if (chosenSlots.includes(i)) {
                newInnerText += 'the the';
            } else {
                newInnerText += 'the';
            }
        }
        
        console.log(workingText);
        columnText.innerHTML = newInnerText;
    }

    handleAdd() {
        document.querySelector('#aValue').innerHTML = document.querySelector('#aValue').innerHTML.replace('[INSERT]', this.examinedLetter);
    }
}



function main() {
    new newspaper.Newspaper(newspaper.password);
};

const waitForPassword = () => {
    if (newspaper.password) {
        main();
    } else {
        setTimeout(waitForPassword, 250);
    }
}

waitForPassword();