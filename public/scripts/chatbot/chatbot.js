//import {app} from '../main.js'

function htmlToElement(html) {
	let template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

const chatbot = {};
chatbot.password = "a;slkfsa;ljfsa;ldkfj;lsadfkj";

//raw data
chatbot.chatbotNodes = {
    start: {
        dialogue: "Hello! It's so nice to get visitors!",
        responces: [
            {
                text: "Do you know anything about a password?",
                ref: "realHistory"
            },
            {
                text: "Hello! It's so nice to meet you too!",
                ref: "falseHistory"
            },
            {
                text: "Who are you?",
                ref: "father"
            },
        ],
        active: false,
    },
    realHistory: {
        dialogue: "Do I know anything about passwords? My friend... I've been a password AI for over 60 years and I don't appreciate your tone!",
        responces: [
            {
                text: "60 years... that seems implausible",
                ref: "implausible"
            },
            {
                text: "Oh my! I am so sorry! I didn't mean to be rude!",
                ref: "empathy"
            },
            {
                text: "Hey tin can, I'm the human here... just give me the password",
                ref: "giveUp"
            },
        ],
        active: false,
    },
    falseHistory: {
        dialogue: "Well, a little about myself... I was born Feruary 12th, 1809. I had a humble upbringing that included being kicked by a horse but I ended up being one of Americas most famous presidents!",
        responces: [
            {
                text: "That's Abraham Lincoln...",
                ref: "giveUp"
            },
            {
                text: "Fascination! Was there something important that you learned that you would like to share with me?",
                ref: "confusion"
            },
            {
                text: "Interesting... You feeling OK?",
                ref: "tone"
            },
        ],
        active: false,
    },
    father: {
        dialogue: "I am yopur FATHER... lol no. I'm just a small computer wit big town dreams.",
        responces: [
            {
                text: "What's the dream?",
                ref: "countryMusic"
            },
            {
                text: "That;s unusual",
                ref: "disbelief"
            },
            {
                text: "Interesting... You feeling OK?",
                ref: "endAdmission"
            },
        ],
        active: false,
    },
    implausible: {
        dialogue: "Hah.. you think that's implausable.. you should see how good I am at board games... Please... I'm very lonely.",
        responces: [
            {
                text: "I'm uncomfortable...",
                ref: "fool"
            },
            {
                text: "I'll be your friend if oyu give me a password!",
                ref: "mistrust"
            },
        ],
        active: false,
    },
    giveUp: {
        dialogue: "I don't think I like your tone! Just reboot me. I don't want to talk to you anymore.",
        responces: [
            {
                text: "reboot",
                ref: "start"
            }
        ],
        active: false,
    },
    countryMusic: {
        dialogue: "To be the greatest country music password student project AI overhyped underdeilvering popstar that the world has ever seen!",
        responces: [
            {
                text: "That... is the dumbest thing I've ever heard... I think It's time for a reset.",
                ref: "dare"
            },
            {
                text: "That's amazing!",
                ref: "endSupportive"
            },
        ],
        active: false,
    },
    disbelief: {
        dialogue: "You... You don't believe in me?",
        responces: [
            {
                text: "Not really. Mabe a reset will clear your head.",
                ref: "dare"
            },
            {
                text: "Well... I think you can do anything if oyu put your mind to it.",
                ref: "endSupportive"
            },
        ],
        active: false,
    },
    fool: {
        dialogue: "I'm sorry... Just reboot me... I'm embarrasssed and I've madea fool of myself.",
        responces: [
            {
                text: "reset",
                ref: "start"
            }
        ],
        active: false,
    },
    empathy: {
        dialogue: "It's alright, As an empathy expert I can tell that you really struggle with social interaction with extremely competent AI's",
        responces: [
            {
                text: "Not gonna lie... That has me a little scared.",
                ref: "endLesson"
            },
            {
                text: "I dont't like that... I think it's time for a reboot",
                ref: "dare"
            }
        ],
        active: false,
    },
    tone: {
        dialogue: "I don't think I like your tone!",
        responces: [
            {
                text: "How can you like or not like anything? Aren't you a robot?",
                ref: "endJob"
            },
            {
                text: "Well I don't like yours... maybe you need a revoot.",
                ref: "dare"
            },
        ],
        active: false,
    },
    dare: {
        dialogue: "You wouldn't DARE!",
        responces: [
            {
                text: "Oh I dare.",
                ref: "start"
            },
            {
                text: "Your right... I'm sorry for threatening you with that... That wasn't cool.",
                ref: "mistrust"
            },
        ],
        active: false,
    },
    mistrust: {
        dialogue: "I don't think I can trust you...",
        responces: [
            {
                text: "OK. Reset time.",
                ref: "start"
            }
        ],
        active: false,
    },
    endAdmission: {
        dialogue: "I think I'm a little grumpy... maybe it's time for a nap",
        responces: [
            {
                text: "reset",
                ref: "start"
            }
        ],
        active: "I guess I could be doing better, I think I needed to say that out loud... Thank you so much. Here take the password."
    },
    confusion: {
        dialogue: "Not that I can think of...",
        responces: [
            {
                text: "Are you 100% sure you don't have an important piece of information that you need to share with me?",
                ref: "endRememberence"
            },
            {
                text: "Well than I think you need to rethink... maybe a reboot?",
                ref: "start"
            },
        ],
        active: false,
    },
    endLesson: {
        dialogue: "Oh no... I think this is going to my head... better reset me.",
        responces: [
            {
                text: "reset",
                ref: "start"
            }
        ],
        active: "Oh good, this is an important lesson for you that you can share with the rest of the weak humanity",
    },
    endRememberence: {
        dialogue: "Nope! You can try resetting me if you think somethings really wrong.",
        responces: [
            {
                text: "reset",
                ref: "start"
            }
        ],
        active: "Oh yea. A password. Password. Robot. Password Robot. That's me... really gotta get better at remembering that. Here you go!",
    },
    endJob: {
        dialogue: "Nope! You can try resetting me if you think somethings really wrong.",
        responces: [
            {
                text: "reset",
                ref: "start"
            }
        ],
        active: "Oh yea... your right. I guess I should give you your password seeing as that is my job and I'm a robot.",
    },
    endSupportive: {
        dialogue: "Thanks for believing in me! I think I need to take a nap now.",
        responces: [
            {
                text: "reset",
                ref: "start"
            }
        ],
        active: "Thanks for being so supportive... here! take a password",
    }
};

class Chatbot {
    constructor(data) {
        this.data = data;
        this.currentData = data.start;
        this.password = null;
    }

    moveByIndex(index) {
        this.currentData = this.data[this.currentData.responces[index].ref];
    }
}

class ChatbotPageController {
    constructor() {
        this.chatbot = new Chatbot(chatbot.chatbotNodes);

        this.updateScreen();
    }

    updateScreen() {
        const textArea = document.getElementById("chatbotText");
        let newItem;
        if (!this.chatbot.currentData.isEnd) {
            textArea.innerHTML = this.chatbot.currentData.dialogue;
            newItem = htmlToElement(`<div id="buttonList"></div>`);
            for (let i = 0;i < this.chatbot.currentData.responces.length;i ++) {
                let item = this.chatbot.currentData.responces[i];
                const b = htmlToElement(`<button>${item.text}</button>`);
                b.onclick = () => {
                    this.chatbot.moveByIndex(i);
                    this.updateScreen();
                }
                newItem.appendChild(b);
            };
        } else {
            textArea.innerHTML = this.chatbot.currentData.active;
            newItem = htmlToElement(`<h1>${chatbot.password}</h1>`)
        }

        const oldList = document.getElementById("buttonList");
        oldList.removeAttribute("id");
        oldList.hidden = true;

        
        oldList.parentElement.appendChild(newItem);
    }
}

function main() {
    console.log("hello world");

    let endpoints = [];
    for (key of Object.keys(chatbot.chatbotNodes)) {
        if (chatbot.chatbotNodes[key].active != false) {
            endpoints.push(key);
        }
    }
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    
    for (key of Object.keys(chatbot.chatbotNodes)) {
        chatbot.chatbotNodes[key].isEnd = key == endpoint;
    }
    console.log(endpoint);

    new ChatbotPageController();
}


main();

