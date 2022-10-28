const app = {} || app;

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
                brick: "random",
                newspaper: parseInt(newspaperInts.join('')),
                passwordle: "random",
                chatbot: "random"
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
    get data() {
        return this._ref.get();
    }
}

app.HomePageController = class {
    constructor() { }

    setPuzzleStatus() {
        app.database.data.then(doc => {
            let puzzleStatus = doc.data().puzzlesCompleted;
            for (let puzzle in puzzleStatus) {
                let puzzleElement = document.getElementById(puzzle);
                if (puzzleStatus[puzzle]) {
                    puzzleElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -32 576 576" width="1em" height="1em" fill="currentColor" class="complete"><path d="M352 192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H288V144C288 64.47 352.5 0 432 0C511.5 0 576 64.47 576 144V192C576 209.7 561.7 224 544 224C526.3 224 512 209.7 512 192V144C512 99.82 476.2 64 432 64C387.8 64 352 99.82 352 144V192z"></path></svg>' + puzzleElement.innerHTML;
                } else {
                    puzzleElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-32 0 512 512" width="1em" height="1em" fill="currentColor"> <path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"></path></svg>' + puzzleElement.innerHTML;
                }
            }
        });
    }
}

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

app.startTimer = () => {
    app.database.data.then(snap => {
        if (snap.data().timeCompleted) {
            let timeTaken = snap.data().timeCompleted - snap.data().timeStarted;
            document.querySelector('#navTimer').innerText = Math.floor(timeTaken / 60).toString().padStart(2, '0') + ":" + Math.floor(timeTaken % 60).toString().padStart(2, '0');
            return;
        }
        const startTime = snap.data().timeStarted;
        let timeTaken = firebase.firestore.Timestamp.now() - startTime;
        app.updateTimer(timeTaken);
    });
}

app.updateTimer = (timeTaken) => {
    document.querySelector('#navTimer').innerText = Math.floor(timeTaken / 60).toString().padStart(2, '0') + ":" + Math.floor(timeTaken % 60).toString().padStart(2, '0');
    setTimeout(() => {
        app.updateTimer(timeTaken + 1);
    }, 1000);
}

app.pageManager = () => {
    if (window.location.pathname == '/' || window.location.pathname == '/index.html') {
        document.querySelector('#authHeader').onclick = () => app.auth.signIn();
        document.querySelector('#authBody').onclick = () => app.auth.signIn();
    } else
        document.querySelector('#authHeader').onclick = () => app.auth.signOut();
    if (window.location.pathname == '/welcome.html')
        document.querySelector('#startBtn').onclick = () => app.database.createUserData();
    if (window.location.pathname == '/puzzles-home.html') {
        app.pageController = new app.HomePageController();
        app.pageController.setPuzzleStatus();
    }
    app.startTimer();
}

app.auth = null;
app.database = null;
app.pageController = null;

app.main = () => {
    app.auth = new app.AuthManager();
    app.auth.beginListening(() => {
        app.checkForRedirects();
        app.pageManager();
    });
}

app.main();