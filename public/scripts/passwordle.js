passwordle = {} || passwordle;
passwordle.userInput = '';
passwordle.allowedKeys = [];

passwordle.main = () => {
    passwordle.newRow();
    window.addEventListener('keydown', e => passwordle.modifyString(e.key));
    passwordle.allowedKeys = 'abcdefghijklmnopqrstuvwxyz0123456789!@#%^*(),.+-_='.split('');
    passwordle.allowedKeys.push('backspace', 'enter');
}

passwordle.modifyString = (key) => {
    if (!passwordle.allowedKeys.includes(key.toLowerCase())) return;
    if (key === 'Backspace') {
        passwordle.userInput = passwordle.userInput.slice(0, -1);
    } else if (key === 'Enter') {
        if (passwordle.userInput.length == 5)
            passwordle.checkInputString();
    } else {
        if (passwordle.userInput.length >= 5) return;
        passwordle.userInput += key;
    }
    passwordle.setString();
}

passwordle.setString = () => {
    let displayBoxes = document.querySelectorAll('.pw-row:first-child > .pw-box');
    for (let i = 0; i < displayBoxes.length; i++) {
        if (i < passwordle.userInput.length) {
            displayBoxes[i].innerHTML = passwordle.userInput[i].toUpperCase();
        } else {
            displayBoxes[i].innerHTML = '';
        }
    }
}

passwordle.checkInputString = () => {
    let displayBoxes = document.querySelectorAll('.pw-row:first-child > .pw-box');
    let correct = [];
    for (let i = 0; i < displayBoxes.length; i++) {
        if (passwordle.password.charAt(i) == displayBoxes[i].innerText) {
            displayBoxes[i].classList.add('correct-location');
            correct.push(passwordle.password.charAt(i));
        }
    }
    for (let i = 0; i < displayBoxes.length; i++) {
        if (passwordle.password.includes(displayBoxes[i].innerText)) {
            let occurences = 0;
            correct.forEach(j => { if (j == displayBoxes[i].innerText) occurences++ });
            if (occurences < passwordle.password.split(displayBoxes[i].innerText).length - 1) {
                displayBoxes[i].classList.add('incorrect-location');
                correct.push(displayBoxes[i].innerText);
            } else
                displayBoxes[i].classList.add('incorrect-character');
        } else
            displayBoxes[i].classList.add('incorrect-character');
    }
    if (correct.length != 5) {
        passwordle.newRow();
    }
}

passwordle.newRow = () => {
    passwordle.userInput = '';
    let row = document.querySelector('#passwordleRow').cloneNode(true);
    document.querySelector('#pwContainer').innerHTML = row.innerHTML + document.querySelector('#pwContainer').innerHTML;
}

passwordle.main();