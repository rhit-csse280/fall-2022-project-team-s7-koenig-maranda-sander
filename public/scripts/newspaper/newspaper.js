const newspaper = {} || newspaper;
newspaper.password = String(Math.floor(Math.random() * 26 + 1));
newspaper.alphabet = 'abcdefghijklmnopqrstuvwxyz';

newspaper.Newspaper = class {
    constructor(password) {
        this.password = password.split('|');

        this.boldIndex = parseInt(this.password[0]);
        this.examinedLetter;

        this.handleArticle();
        this.handleAdd();
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

    handleAdd() {
        document.querySelector('#aValue').innerHTML = document.querySelector('#aValue').innerHTML.replace('[INSERT]', this.examinedLetter);
    }
}



function main() {
    console.log(newspaper.password);
    new newspaper.Newspaper(newspaper.password);
};
main();