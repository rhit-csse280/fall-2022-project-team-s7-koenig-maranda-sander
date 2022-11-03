const app = {} || app;
window.app = app;
app.NUMBER_OF_PUZZLES = 4;

app.auth = null;
app.database = null;
app.pageController = null;


/**
 * Class: AuthManager
 * Controls Firebase authentication
*/
app.AuthManager = class {
    constructor() {
        this._user = null;
    }

    beginListening(changeListener) {
        firebase.auth().onAuthStateChanged(user => {
            this._user = user;
            changeListener();
        });
    }
    signIn() {
        Rosefire.signIn('4d5214a6-81b4-4344-afd4-8f1b2de0927a', (err, rfUser) => {
            if (err) {
                console.error(err);
                return;
            }
            firebase.auth().signInWithCustomToken(rfUser.token).then(() => {
                firebase.auth().currentUser.updateProfile({
                    displayName: rfUser.name
                });
                app.database = new app.UserDatabaseManager(firebase().auth.currentUser.uid);
            }).catch(err => {
                console.error(err);
                return;
            });
        });
    }
    signOut() {
        firebase.auth().signOut();
    }
    get uid() {
        return this._user.uid;
    }
    get displayName() {
        return this._user.displayName;
    }
    get isSignedIn() {
        return !!this._user;
    }
}

/**
 * Class: UserDatabaseManager
 * Creates, reads, and modifies user-specific data.
 */
app.UserDatabaseManager = class {
    constructor(uid) {
        this._documentSnapshot = {};
        this._unsubscribe = null;
        this._ref = firebase.firestore().collection('users').doc(uid);
    }

    createUserData() {
        if (window.location.pathname != '/welcome.html') return;
        let newspaperInts = [];
        for (let i = 0; i < 4; i++)
            newspaperInts.push(Math.floor(Math.random() * (10 - 1) + 1));
        this._ref.set({
            name: app.auth.displayName,
            puzzlePasswords: {
                brick: app.getRandomText(8),
                newspaper: parseInt(newspaperInts.join('')),
                passwordle: app.getRandomText(5),
                chatbot: app.getRandomText(8)
            },
            puzzlesCompleted: {
                brick: false,
                newspaper: false,
                passwordle: false,
                chatbot: false
            },
            timeCompleted: null,
            timeStarted: firebase.firestore.Timestamp.now()
        }).then(() => window.location.pathname = '/puzzles-home.html');
    }
    puzzleCompleted(puzzleName) {
        this._ref.update({
            [`puzzlesCompleted.${puzzleName}`]: true
        });
    }
    stopTimer() {
        this._ref.update({
            timeCompleted: firebase.firestore.Timestamp.now()
        });
    }
    get data() {
        return this._ref.get();
    }
}

/**
 * Generates a random string of charaters of a given length.
 * @param length number of characters to generate
 * @returns string of random characters
 */
app.getRandomText = length => {
    let result = '';
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#%^*(),.+-_=';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * Class: HomePageController
 * Manages general puzzle information on the list page.
 */
app.HomePageController = class {
    constructor() {
        document.querySelector('#passwordSubmit').onclick = () => this.checkPassword(document.querySelector('#passwordText').value);
    }

    setPuzzleStatus() {
        app.database.data.then(doc => {
            let puzzleStatus = doc.data().puzzlesCompleted;
            let puzzlesCompleted = 0;
            for (let puzzle in puzzleStatus) {
                let puzzleElement = document.querySelector(`#${puzzle} > span`);
                if (puzzleStatus[puzzle]) {
                    puzzlesCompleted++;
                    puzzleElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -32 576 576" width="1em" height="1em" fill="currentColor" class="complete"><path d="M352 192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H288V144C288 64.47 352.5 0 432 0C511.5 0 576 64.47 576 144V192C576 209.7 561.7 224 544 224C526.3 224 512 209.7 512 192V144C512 99.82 476.2 64 432 64C387.8 64 352 99.82 352 144V192z"></path></svg>';
                } else {
                    puzzleElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-32 0 512 512" width="1em" height="1em" fill="currentColor"> <path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"></path></svg>';
                }
            }
            if (puzzlesCompleted = app.NUMBER_OF_PUZZLES && !doc.data().timeCompleted) {
                app.database.stopTimer();
                this.gameOver();
            }
        });
    }
    checkPassword(input) {
        app.database.data.then(doc => {
            let puzzlePasswords = doc.data().puzzlePasswords;
            for (let puzzle in puzzlePasswords) {
                if (input == puzzlePasswords[puzzle]) {
                    app.database.puzzleCompleted(puzzle);
                    break;
                }
            }
        }).then(() => this.setPuzzleStatus());
    }
    gameOver() {
        window.location.pathname = '/game-over.html';
    }
}

/**
 * Class: LeaderboardPageController
 * Manages ranking data for the leaderboard page.
 */
app.LeaderboardPageController = class {
    constructor() {
        this._ref = null;
        this.getLeaderboardData()
            .then(() => this.setTopFive()
                .then(() => this.setRanking()));
    }

    getLeaderboardData() {
        return new Promise((resolve, reject) => {

        });
    }
    setTopFive() {
        return new Promise((resolve, reject) => {

        });
    }
    addUserUnranked() {

    }
}

/**
 * Redirects the user to the welcome page if this is their first time playing.
 */
app.checkForRedirects = () => {
    const onLoginPage = window.location.pathname == '/' || window.location.pathname == '/index.html';
    if (app.auth.isSignedIn) {
        app.database = new app.UserDatabaseManager(app.auth.uid);
        app.database.data.then(db => {
            if (!db.exists && window.location.pathname != '/welcome.html')
                window.location.href = '/welcome.html';
            else if ((onLoginPage || window.location.pathname == '/welcome.html') && db.exists)
                window.location.href = '/puzzles-home.html';
        });
    }
    else if (!onLoginPage && !app.auth.isSignedIn)
        window.location.href = '/index.html';
}

/**
 * Starts the escape room timer.
 */
app.startTimer = () => {
    app.database.data.then(snap => {
        if (snap.data().timeCompleted) {
            let timeTaken = snap.data().timeCompleted - snap.data().timeStarted;
            document.querySelector('#navTimer').innerText = Math.floor(timeTaken / 60).toString().padStart(2, '0') + ":" + Math.floor(timeTaken % 60).toString().padStart(2, '0');
            return;
        }
        const startTime = snap.data().timeStarted;
        const endTime = snap.data().timeCompleted;
        let timeTaken = (endTime) ? endTime - startTime : firebase.firestore.Timestamp.now() - startTime;
        app.updateTimer(timeTaken, !!endTime);
    });
}

/**
 * Updates the timer value displayed to the player.
 * @param timeTaken time taken in seconds
 * @param completed determines if the timer should stop updating
 */
app.updateTimer = (timeTaken, completed) => {
    document.querySelector('#navTimer').innerText = Math.floor(timeTaken / 60).toString().padStart(2, '0') + ":" + Math.floor(timeTaken % 60).toString().padStart(2, '0');
    if (!completed)
        setTimeout(() => {
            app.updateTimer(timeTaken + 1);
        }, 1000);
}

/**
 * Defines objects and functions based on the current page.
 */
app.pageManager = () => {
    if (window.location.pathname == '/' || window.location.pathname == '/index.html') {
        document.querySelector('#authHeader').onclick = () => app.auth.signIn();
        document.querySelector('#authBody').onclick = () => app.auth.signIn();
    } else
        document.querySelector('#authHeader').onclick = () => app.auth.signOut();
    switch (window.location.pathname) {
        case '/welcome.html':
            document.querySelector('#startBtn').onclick = () => app.database.createUserData();
            break;
        case '/puzzles-home.html':
            app.pageController = new app.HomePageController();
            app.pageController.setPuzzleStatus();
            break;
        case '/leaderboard.html':
            app.pageController = new app.LeaderboardPageController();
            break;
    }
    app.startTimer();
}

/**
 * Initializes the app.
 */
app.main = () => {
    app.auth = new app.AuthManager();
    app.auth.beginListening(() => {
        app.checkForRedirects();
        app.pageManager();
    });
}

app.main();