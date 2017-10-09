//////////////////////////////////////////////////////////////////////////////
//									BOT.JS									//
//////////////////////////////////////////////////////////////////////////////
/*

*/
var setup = function(){
	var fdiv = document.getElementById("fleurbot");
	var fmssg = document.createElement("div");
	fmssg.id = "fbotmessages";
	fdiv.appendChild(fmssg);
	var finput = document.createElement("div");
	finput.id = "fbotinput";
	var ftext = document.createElement("textarea");
	ftext.id = "fbottextarea";
	ftext.name="fbotinput";
	ftext.autofocus="true";
	ftext.maxlength="40";
	ftext.placeholder="Message";
	//ftext.onkeypress = submitToBot;
	ftext.addEventListener ("keypress", submitToBot);
	finput.appendChild(ftext);
	var fsend = document.createElement("div");
	fsend.id = "fbotsend";
	fsend.onclick = function(){submitToBot()};
	fsend.innerHTML = "Send";
	finput.appendChild(fsend);
	fdiv.appendChild(finput);
}
setup();
setup = null;

function checkList(i, w, n) {
	var obj = {
				id: i,
				words: w,
			  };
	
	if(n !== "undefined")
		obj.needed = n;
	
	return obj;
}

function keyList(act, w, an){
	var obj = {};
	
	if (act !== "undefined")
		obj.action = act;
	
	if (w !== "undefined")
		obj.words = w;
	
	if (an !== "undefined")
		obj.any = an;
	
	return obj;
}

function answerList(b,w) {
	var obj = { branches:b	};
	if (w !== "undefined")
		obj.wait = w;
	return obj;
}


//var cl = checkList(id, words, true);
//var kl = keyList(action, words , true);
//var al = answerList(branches,false);

//////////////////////////////////////////////////////////////////////////////
//									TEXTS									//
//////////////////////////////////////////////////////////////////////////////

var botdata = {}
botdata.vocab = {
	yes:["ok","ja","yes","yep","si","okay","yeah","correct"],
	no:["no","nope","nein","nah","false","wrong"],
	article:["a","an","the","some"],
	hello:["hi", "hello", "good morning", "goog evening", "good night", "ciao",],
	
	vAction:["faire","","","","","","","","","","","","","","","","","","",""],
	
	number: function(v) { return (v == Number(v)); },
	
}

botdata.triggers = { }

botdata.keywords = [

	keyList("hello",getVocab("hello"),true),
	
]

botdata.actions = {
	checktest: [{autor:'admin',text:"keytest: ##letters & ##letters",},],
	
	hello : 
		[ 
			{
				autor:"admin",
				text:"Hello"
			}
		],
		
	is_short :
		[ 
			{
				autor:"admin",
				text:"\qt ?",
				answer: answerList(
				[
				keyList([{autor:"admin",text:"Okay."}],
						["oui","yes","ok"],
						true),			
				keyList([{autor:"admin",text:"..."}],
						["non","no","nope","na"],
						true)
				],
				false),
			}
		],
		
	quit :
		[
			{
				autor:"admin",
				text:"I'm not here to be insulted...",
			},
			{ 	fn:function(){drawNewLog("Admin left the chatroom.");},
				delay:3000,
				answer: answerList(
					[
						keyList(
								[ {} ]
								),
					]
					,true),
			},
		]
	
}

botdata.generic = {
	repeat: 
		[	
			"...Are you a Bot ?",
			
		],
	none:
		[
			[
				{
					autor:"admin",
					text:"[https://www.google.com/search?q=\fqt](This should help you...)"
				},
			],
		],
		
}

botdata.characters = {
	user:
		{
			name: "Visitor",
			avatar: "user.png",
			color: "green"
		},
		
	admin:
		{
			name: "Service Bot",
			avatar: "computer.png",
			color: "gold"
		},
}

//console.log(botdata.vocab.nombre);

//////////////////////////////////////////////////////////////////////////////
//								VARIABLES									//
//////////////////////////////////////////////////////////////////////////////

var currCharacter = "";

/* ==botAction==
	.next 		(array) 	the next action to execute.
	.last 		(array) 	the last executed action.
	.currAutor 	(string)	the current character.
	.lastAutor	(string)	the last character.
	.repeat()	(function)	return true if .next == .last
*/
var botAction = {
					next:[],
					last:[],
					currentAutor:"",
					lastAutor:"",
					repeat:function(){return (this.next == this.last);}
				};

/* ==userInput==
	.current 	(string) 	the current input.
	.format 	(string) 	the .current formated with stripString().
	.list	 	(array)		A list of each words of .format.
	.isQuestion	(boolean)	TRUE if .current contain an '?'.
*/				
var userInput = {
					current: "",
					format: "",
					list: [],
					last: "",
					isQuestion: false,
					checks: {},
				};
				
//var state = "";
//var mode = "";
var answer = {};


//////////////////////////////////////////////////////////////////////////////
//							HTML DOM ELEMENTS								//
//////////////////////////////////////////////////////////////////////////////

/* The Input Field */
var textInput = document.getElementById('fbottextarea');

/* The Div Containing The Messages */
var chatBox = document.getElementById('fbotmessages');

/* The 'is writing' Image (className = "writing" ) */
var writing = document.createElement('img');
writing.src = "writing.png";
writing.className = "fbot_writing";

//////////////////////////////////////////////////////////////////////////////
//								FUNCTIONS									//
//////////////////////////////////////////////////////////////////////////////

setUserColor();

/* ==Submit A Message To Bot==
	- event must be 'keyCode 13' (ENTER)
	  or null.
	- text in the writing field must be > 0
*/
function submitToBot(event) {
	if(event && event.keyCode != 13){
		return false;
	}
	var v = textInput.value.trim();
	if(v.length > 0) {
		newInput(v);
	}
}

/* ==Set Up A New Input== 
	- disable the writing field.
	- set up the userInput variables.
	- empty the writing field.
	- execute display & process of 
	  the input.
*/
function newInput(v) {
	//botAction.currentAutor = "user";
	inputState(false);
	userInput.current = v;
	userInput.format = stripString(v);
	userInput.list = userInput.format.split(" ");
	emptyInput();
	displayInput();
	processInput();
}

/* ==Display Input== 
	- draw the current input then 
	  scroll to end of chat box.
*/
function displayInput(){
	drawNewInput();
	scrollToEnd();
}

/* ==Empty Input Field== */
function emptyInput() {
	textInput.value = "";
}

/* ==Draw A New Bot Post== 
- 'autor' 	= autor as a string.
- 'content' = the text to be written.
	- if autor == botAction.lastAutor
	  the post is added to the previous one.
*/
function drawNewPost(autor, content) {
	//console.log("CurrentAutor: " + botAction.currentAutor);
	//console.log("paramAutor: " + autor);
	
	if(botAction.lastAutor == autor && autor != ""){	
	
		var p = document.createElement('p');
		p.innerHTML = escapeCharacters(content);
		
		chatBox.lastElementChild.appendChild(p);
		
	} else {
		var act = botdata.characters[autor];
		
		var post = document.createElement('div');
		post.className = "fbot_mssg bot";
		
		if (act.avatar){
			var img = document.createElement('img');
			img.src = act.avatar;
		}
		
		var hd = document.createElement('h1');
		var name = act.name ? act.name : autor;
		hd.innerHTML = name;
		hd.style.color = act.color;
		
		var p = document.createElement('p');
		p.innerHTML = escapeCharacters(content);
		
		if (act.avatar){ post.appendChild(img); }
		post.appendChild(hd);
		post.appendChild(p);
			
		chatBox.appendChild(post);
		botAction.lastAutor = autor;
	}
	scrollToEnd();
}

/* ==Draw A New User Post==
	- draw the post containing 
	  the current input.
*/
function drawNewInput() {
	if(botAction.lastAutor == "user"){
		
		var p = document.createElement('p');
		p.innerHTML = userInput.current;
		
		chatBox.lastElementChild.appendChild(p);
		
	} else {
		var autor = botdata.characters.user;
		
		var post = document.createElement('div');
		post.className = "fbot_mssg user";
		
		if(autor.avatar){
			var img = document.createElement('img');
			img.src = autor.avatar;
			img.style.backgroundColor = autor.color;
		}
		
		var hd = document.createElement('h1');
		var name = "User";
		if (autor.name)
			name = autor.name;
		hd.innerHTML = name;
		hd.style.color = autor.color;
		
		var p = document.createElement('p');
		p.innerHTML = userInput.current;
		
		if(autor.avatar){ post.appendChild(img); }
		post.appendChild(hd);
		post.appendChild(p);
			
		chatBox.appendChild(post);
		botAction.lastAutor = "user";
	}
}

function drawNewLog(v) {
	
	var post = document.createElement('div');
	post.className = "fbot_log";
	
	var p = document.createElement('p');
	p.innerHTML = v;
	
	post.appendChild(p);
		
	chatBox.appendChild(post);
	botAction.lastAutor = "";
	
	scrollToEnd();
}

/* ==Process A New Input== 
	- check if the input triggers anything
	  and set & process the botAction.next.
	- if the botAction.next == botAction.last
	  no actions is processed.
*/
function processInput() {
	
	var time = 500;
	if (isAnswer()) {
		console.log('isAnswer');
	
	} else if(isRepeat()){
		console.log('isRepeat');
		
	} else if (isTrigger()) {
		console.log('isTrigger');
		
	} else if (includeKey()) {
		console.log('includeKey');
		
	} else if (isShort()) {
		//return;
		console.log('isShort');
	} else if (noReaction()) {
		return;
	} else {
		console.log('notUnderstood');
		notUnderstood();
	}
	
	var read = userInput.current.length*50;
	
	//setTimeout(showWriting,read);
	
	time += Math.ceil((Math.random()*500)-250);
	if (botAction.repeat()){
		inputState(true);
	} else {	
		setTimeout(processAllActions,read+time);
	}
	
	userInput.last = userInput.format;
}

/* ==No Reaction== */
function noReaction() {
	return false;
	/* if(Math.random() > 0.25){
		botAction.next = [];
		inputState(true);
		emptyInput();
		return true;
	} else {
		return false;
	} */
}

/* ==Input Triggers Nothing== 
	- create an action with a 
	  botdata.generic.none[random] text.
*/
function notUnderstood() {
	var l = botdata.generic.none.length;
	var r = Math.floor(Math.random()*l);
	//console.log(botdata.generic.none[r].autor);
	botAction.next = botdata.generic.none[r];
}

/* ==Input Is Too Short== 
	- if the input.length is < 3
	  create an action with 
	  "input ?" as the text.
*/
function isShort() {
	
		
	if(userInput.format.length < 3){
		
		botAction.next = getAction("is_short");
		return true;
		
		/* var na = [];
		var aa = {
			autor: botAction.currentAutor,
			text: userInput.current + ' ?'
		}
		na[0] = aa;
		botAction.next = na;
		return true; */
	} else {
		return false;
	}
}

/* ==Input Is The Same Than The Last One== 
	- create an action with a 
	  botdata.generic.repeat[random] text.
*/
function isRepeat() {
	if(userInput.format == userInput.last) {
		var l = botdata.generic.repeat.length;
		var r = Math.floor(Math.random()*l);
		
		var na = [{
			autor: botAction.currentAutor,
			text: botdata.generic.repeat[r]
			},];
		
		botAction.next = na;
		return true;
	} else {
		return false;
	}
}

/* ==Input Triggers A Precise Action== 
	- input == one of the botdata.triggers[] phrases.
*/
function isTrigger() {
	//return;
	var b = false;
	var keys = Object.keys(botdata.triggers);
	
	var i = 0;
	for(i=0;i<keys.length;i++){
		if(userInput.format == keys[i]) {
			var ta = botdata.triggers[userInput.format];
			botAction.next = getAction(ta);
			b = true;
			break;
		}
	}
	
	return b;
}

/* ==Input Include A Set Of Keywords== 
	- input matches a set of botdata.keywords[]
*/
function includeKey() {
	
	var b = false;
	var act_nb = -1;
	var best = 0;
	
	var i = 0;
	for(i in botdata.keywords){
		var nb = compareSet(botdata.keywords[i],userInput.list);
		if(nb < 0.5)
			nb = 0.0;
		/* console.log("base: " + botdata.keywords[i].words,
					"in: " + userInput.list,
					"matched: " + nb); */
		if (nb > best){
			act_nb = i;
			best = nb;
		}
	}
	
	 console.log("best: " + best,
				"act_id: " + act_nb);
				
	console.log(getAction(botdata.keywords[0]));
	
	if (best == 0)
		return false;
	
	botAction.next = getAction(botdata.keywords[act_nb].action);
	return true;
}

/* ==Compare Two Sets Of Words== 
- 'base' is a keyList().
- 'arr' is an array of words.

	- return the matching % between base & arr.
	
	- if base.any == TRUE 
	  && one of 'arr' words match the base
		- return 1.0
*/
function compareSet(base,arr){
	var tot = 0;
	var matched_any = false;
	var breakable = false;
	var invalid = false;
	
	var words = base.words;
	var in_arr = arr;
	
	var a = 0;
	var b = 0;
	
	for (b in words) {
		var b_w = words[b];
			
		for(a in in_arr){
			var in_w = in_arr[a];
			
			if(typeof(b_w) == "object"){
				console.log("checkList in keylist - " + base.action);
				if(iterateCheckList(b_w,in_w)){
					var invalid = false;
					tot += 1;
					if (base.any) {
						matched_any = true;
					}
					break;
				} else {
					var invalid = true;
				}
				
			} else if(typeof(b_w) == "function"){
				console.log('function in keylist - ' + base.action);
				var b = b_w(in_w); //TODO if match => userInput.check[base.id] = in_w
				if(b == true){
					//userInput.check[base.id] = in_w;
					tot += 1;
					if (base.any) {
						matched_any = true;
						breakable = true;
						break;
					}
				}
				
			} else if(b_w == in_w){
				tot += 1;
				if (base.any) {
					matched_any = true;
					breakable = true;
					break;
				}
			}
			
		}
		
		if(breakable)
			break;
	}
	
	var tot_a = tot/in_arr.length; 	// the % of matched words in 'arr'
	var tot_b = typeof(words) == "object" ? tot/words.length : 0.5; 	// the % of matched words in 'base'
	
	// if base.any && matched_any => return 1.0 else return median of tot_a & tot_b
	var p = matched_any ? 1.0 : (tot_a+tot_b)*0.5;
	if (invalid)
		p = 0;
	
	//var f = p < 0.5 ? 0 : p;
	
	/* console.log("tot_matched: " + tot,
				"percent: " + (tot_a+tot_b)*0.5,
				"final score: " + p); */
	
	return p;
}

function iterateCheckList(chklist,word) {
	
	var warr = chklist.words;
	var i = 0;
	var a = 0;
	
	/* console.log("checklist: " + warr,
				"word: " + word); */
				
	if(warr.includes(word)){
		userInput.checks[chklist.id] = word;
		return true;
	}
		
	if(chklist.needed)
		return false;
		
	return true;
}

/* ==Input Triggers An Awaited Answer== 
	- if answer.wait == TRUE
		- each inputs will be consedered 
		  as answers until one of the wanted
		  input is submited.
	- else
		- check if the input triggers any
		  answer.branches and set the botAction.next.
		- process the default branch if no
		  other is triggered.
*/
function isAnswer() {
	if (!answer.branches)
		return false;
		
	var i = 0;
	for (i in answer.branches) {
		var branch = answer.branches[i];
		branch.any = true;
		if (branch.words) {
			var nb = compareSet(branch,userInput.list);
			/* console.log("branch: " + branch.words,
						"input: " + userInput.list,
						"matched: " + nb); */
			if(nb >= 0.5) {
				botAction.next = getAction(branch.action);
				break;
			}
		} else {
			botAction.next = getAction(branch.action);
			break;
		}
	}
	if(!answer.wait){
		answer = {};
		return false;
	}
	
	return true;
}

/* ==Strip A Given String==
	- check if string contain an '?' and set the userInput.isQuestion.
	- delete all ponctuation and unwanted spaces
	- put the string to lower case
	- trim the left & right space
*/
function stripString(v) {
	userInput.isQuestion = v.includes('?');
	var pless = v.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g,"");
	var fs = pless.replace(/\s{2,}/g," ");
	fs = fs.toLowerCase();
	fs = fs.trim();
	return fs;
}

/* ==Input Field State==
	- TRUE => allow writing.
	- FALSE => disable writing.
*/
function inputState(v) {
	textInput.disabled = !v;
	if (v)
		textInput.focus();
}

/* ==Process All Actions== 
	- set delay depending on the text.length before executing an action.
*/
function processAllActions() {
	
	showWriting();
	
	var time = 500;
	var na = botAction.next;
		
	var fn = function(v,end){
		return function(){
			hideWriting();
			if(doAction(v)){
				showWriting();
			} else {
				inputState(true);
				botAction.last = botAction.next;
				botAction.next = [];
			}
		}
	}
	
	var i = 0;
	for (i=0;i<na.length;i++){
		
		var b = (i == na.length-1)
		
		time += na[i].text ? na[i].text.length*10 : 200;
		if (na[i].delay)
			time += na[i].delay;
		
		setTimeout(fn(i,b),time);
	}
}

/* ==Execute An Action== 
	- execute the 'i' action of the botAction list.
	- set the botAction.currentAutor
	- draw a new post if the action contain some text.
	- set up the 'answer' if needed.
	- execute the action function.
	- return FALSE if action is the last.
*/
function doAction(i) {
	var a = botAction.next[i];
	
	botAction.currentAutor = botAction.lastAutor;
	
	if (a.autor && botAction.currentAutor != a.autor)
		botAction.currentAutor = a.autor
	
	if(a.text)
		drawNewPost(botAction.currentAutor,a.text);
	
	if(a.answer)
		answer = a.answer;
	
	if (a.fn)
		a.fn();
	
	return botAction.next[i+1] ? true : false;
}

/* ==Set & Get The User Informations== 
	- check for localStorage
		- if found, set or get user color & avatar.
		- if not found set user color & avatar randomly.
*/
function setUserColor() {
	if (typeof(Storage) !== "undefined") {
		if (localStorage.color) {
			//botdata.characters.user.avatar = localStorage.avatar;
			botdata.characters.user.color = localStorage.color;
		} else {
			var col = randColor();
			//var r = Math.random() < 0.5 ? 1 : 2;
	    	//localStorage.setItem("avatar", "frog" + r + ".png");
	    	localStorage.setItem("color", col);
			//botdata.characters.user.avatar = localStorage.avatar;
			botdata.characters.user.color = localStorage.color;
		}
	} else {
		botdata.characters.user.color = randColor();
		//var rnd = Math.random() < 0.5 ? 1 : 2;
		//botdata.characters.user.avatar = "frog" + rnd + ".png";
	}
	//textInput.parentNode.style.backgroundColor = botdata.characters.user.color;
}

/* ==Return A Random Color As A String== 
	- range is [100-255] for each canals
*/
function randColor(){
	var r = Math.floor(Math.random() * 155)+100;
	var g = Math.floor(Math.random() * 155)+100;
	var b = Math.floor(Math.random() * 155)+100;
	var col = "rgb(" + r + "," + g + "," + b + ")";
	return col;
}

/* ==Scroll The 'chatbox' To The End== */
function scrollToEnd() {
	window.scrollTo(0,chatBox.scrollHeight);
}

/* ==Show The 'is writing' Image== */
function showWriting() {
	chatBox.appendChild(writing);
	scrollToEnd();
}

/* ==Hide The 'is writing' Image== */
function hideWriting() {
	var w = document.querySelector('.fbot_writing');
	if(w)
		w.parentNode.removeChild(w);
}

/* ==Get The Next Action==
	- a string will return 'botdata.actions[string]'
	- a function will return a empty action containnig the function.
	- an object will be returned as an action.
*/
function getAction(v) {
	
	if (typeof(v) == "object"){
		return v;
		
	} else if (typeof(v) == "function"){
		var nafn = [{fn:v}];
		return nafn;
		
	} else if (typeof(v) == "string"){
		var nast = botdata.actions[v];
		return nast;
		
	} else {
		// default => return an empty action
		var nano = [{fn:function(){return;}}];
		return nano;
	}	
}

function getVocab(id) {
	if(botdata)
	return botdata.vocab[id];
}

/* ==Escape Specials Characters==
	- '\qt' => the last user input
	- '\#id' => the last match of checkList named "id"
*/
function escapeCharacters(string) {
	var prostr = string;
	
	var prostr = prostr.replace(/\qt/g,userInput.current); // convert '\qt' 
	var prostr = prostr.replace(/\fqt/g,userInput.current); // convert '\fqt' 
	var prostr = prostr.replace(/(##[\w\d]+)/g,checkMatch); // convert '\#xx'
	var prostr = prostr.replace(/\[(.+)\]\((.+)\)/,convertLink); // convert '[http](link)'
	
	//console.log(prostr);
	return prostr;
}

function formatToQuery(match,qry){
	console.log("The Query Is: " + qry);
	var s = qry
	s = qry.replace(/ /,"&20");
	s = qry.replace(/,/,"%2C");
	//s = qry.replace(/?/,"%3F");
	s = qry.replace(/#/,"%23");
	s = qry.replace(/=/,"%3D");
	return s
}

function convertLink(match,url,lnk){
	//console.log("The Link Is: " + url);
	var string = "<a href=\"" + url + "\" target=_blank>" + lnk + "</a>"
	return string
}

function checkMatch(match,id){
	//console.log("The Check Result Is: " + id);
	var s = id.replace(/##/,"");
	return userInput.checks[s] ? userInput.checks[s] : "";
}

/* ==Fire A Given Action==
	- 'act' can be :
		- a string refering to an botdata.actions[xx]
		- an object containing an action
		- a function
*/
function fireAction(act) {
	inputState(false);
	botAction.next = getAction(act);
	processAllActions();
}
