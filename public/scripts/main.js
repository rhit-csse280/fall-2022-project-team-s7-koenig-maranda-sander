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
        console.log('Not yet implemented');
    }
    get data() {
        return this._ref.get();
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

app.pageManager = () => {
    if (window.location.pathname == '/' || window.location.pathname == '/index.html') {
        document.querySelector('#authHeader').onclick = () => app.auth.signIn();
        document.querySelector('#authBody').onclick = () => app.auth.signIn();
    } else
        document.querySelector('#authHeader').onclick = () => app.auth.signOut();

    if (window.location.pathname == '/welcome.html')
        app.database.createUserData();
}

app.auth = null;
app.database = null;

app.main = () => {
    app.auth = new app.AuthManager();
    app.auth.beginListening(() => {
        app.checkForRedirects();
        app.pageManager();
    });
}

app.main();