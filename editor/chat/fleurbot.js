

//console.log(fleurbot.data.vocab.nombre);

//////////////////////////////////////////////////////////////////////////////
//								VARIABLES									//
//////////////////////////////////////////////////////////////////////////////

fleurbot.currCharacter = "";

/* ==botAction==
	.next 		(array) 	the next action to execute.
	.last 		(array) 	the last executed action.
	.currAutor 	(string)	the current character.
	.lastAutor	(string)	the last character.
	.repeat()	(function)	return true if .next == .last
*/
fleurbot.botAction = {
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
fleurbot.userInput = {
					current: "",
					format: "",
					list: [],
					last: "",
					isQuestion: false,
					checks: {},
				};
				
//var state = "";
//var mode = "";
fleurbot.answer = {};


//////////////////////////////////////////////////////////////////////////////
//								FUNCTIONS									//
//////////////////////////////////////////////////////////////////////////////



/* ==Escape Specials Characters==
	- '\qt' => the last user input
	- '\#id' => the last match of checkList named "id"
*/
fleurbot.escapeCharacters = function(string) {
	var prostr = string;
	
	var prostr = prostr.replace(/\qt/g,fleurbot.userInput.current); // convert '\qt' 
	var prostr = prostr.replace(/\fqt/g,fleurbot.userInput.current); // convert '\fqt' 
	var prostr = prostr.replace(/(##[\w\d]+)/g,fleurbot.checkMatch); // convert '\#xx'
	var prostr = prostr.replace(/\[(.+)\]\((.+)\)/,fleurbot.convertLink); // convert '[http](link)'
	
	//console.log(prostr);
	return prostr;
}

/* ==Submit A Message To Bot==
	- event must be 'keyCode 13' (ENTER)
	  or null.
	- text in the writing field must be > 0
*/
fleurbot.submitToBot = function(event) {
	if(event && event.keyCode != 13){
		return false;
	}
	var v = fleurbot.textInput.value.trim();
	if(v.length > 0) {
		fleurbot.newInput(v);
	}
}

/* ==Set Up A New Input== 
	- disable the writing field.
	- set up the userInput variables.
	- empty the writing field.
	- execute display & process of 
	  the input.
*/
fleurbot.newInput =function(v) {
	fleurbot.inputState(false);
	fleurbot.userInput.current = v;
	fleurbot.userInput.format = fleurbot.stripString(v);
	fleurbot.userInput.list = fleurbot.userInput.format.split(" ");
	fleurbot.emptyInput();
	fleurbot.displayInput();
	fleurbot.processInput();
}

/* ==Display Input== 
	- draw the current input then 
	  scroll to end of chat box.
*/
fleurbot.displayInput = function(){
	fleurbot.drawNewInput();
	fleurbot.scrollToEnd();
}

/* ==Empty Input Field== */
fleurbot.emptyInput = function() {
	fleurbot.textInput.value = "";
}

/* ==Draw A New Bot Post== 
- 'autor' 	= autor as a string.
- 'content' = the text to be written.
	- if autor == botAction.lastAutor
	  the post is added to the previous one.
*/
fleurbot.drawNewPost = function(autor, content) {
	
	if(fleurbot.botAction.lastAutor == autor && autor != ""){	
		var p = document.createElement('p');
		p.innerHTML = fleurbot.escapeCharacters(content);
		chatBox.lastElementChild.appendChild(p);
	} else {
		var act = fleurbot.data.characters[autor];
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
		p.innerHTML = fleurbot.escapeCharacters(content);
		if (act.avatar){ post.appendChild(img); }
		post.appendChild(hd);
		post.appendChild(p);
		fleurbot.chatBox.appendChild(post);
		fleurbot.botAction.lastAutor = autor;
	}
	fleurbot.scrollToEnd();
}

/* ==Draw A New User Post==
	- draw the post containing 
	  the current input.
*/
fleurbot.drawNewInput = function() {
	if(fleurbot.botAction.lastAutor == "user"){
		
		var p = document.createElement('p');
		p.innerHTML = fleurbot.userInput.current;
		
		fleurbot.chatBox.lastElementChild.appendChild(p);
		
	} else {
		var autor = fleurbot.data.characters.user;
		
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
		p.innerHTML = fleurbot.userInput.current;
		
		if(autor.avatar){ post.appendChild(img); }
		post.appendChild(hd);
		post.appendChild(p);
			
		fleurbot.chatBox.appendChild(post);
		fleurbot.botAction.lastAutor = "user";
	}
}

fleurbot.drawNewLog = function(v) {
	
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
fleurbot.processInput = function() {
	
	var time = 500;
	if (fleurbot.isAnswer()) {
		//console.log('isAnswer');
	
	} else if(fleurbot.isRepeat()){
		//console.log('isRepeat');
		
	} else if (fleurbot.isTrigger()) {
		//console.log('isTrigger');
		
	} else if (fleurbot.includeKey()) {
		//console.log('includeKey');
		
	} else if (fleurbot.isShort()) {
		//console.log('isShort');
	} else if (fleurbot.noReaction()) {
		//return;
	} else {
		//console.log('notUnderstood');
		fleurbot.notUnderstood();
	}
	
	var read = fleurbot.userInput.current.length*50;
	
	//setTimeout(showWriting,read);
	
	time += Math.ceil((Math.random()*500)-250);
	if (fleurbot.botAction.repeat()){
		fleurbot.inputState(true);
	} else {	
		setTimeout(fleurbot.processAllActions,read+time);
	}
	
	fleurbot.userInput.last = fleurbot.userInput.format;
}

/* ==No Reaction== */
fleurbot.noReaction = function() {
	return false;
/* 	if(Math.random() > 0.25){
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
	  fleurbot.data.generic.none[random] text.
*/
fleurbot.notUnderstood = function() {
	var l = fleurbot.data.generic.none.length;
	var r = Math.floor(Math.random()*l);
	//console.log(fleurbot.data.generic.none[r].autor);
	fleurbot.botAction.next = fleurbot.data.generic.none[r];
}

/* ==Input Is Too Short== 
	- if the input.length is < 3
	  create an action with 
	  "input ?" as the text.
*/
fleurbot.isShort = function() {
	
		
	if(fleurbot.userInput.format.length < 3){
		
		fleurbot.botAction.next = fleurbot.getAction("is_short");
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
	  fleurbot.data.generic.repeat[random] text.
*/
fleurbot.isRepeat = function() {
	if(fleurbot.userInput.format == fleurbot.userInput.last) {
		var l = fleurbot.data.generic.repeat.length;
		var r = Math.floor(Math.random()*l);
		
		var na = [{
			autor: fleurbot.botAction.currentAutor,
			text: fleurbot.data.generic.repeat[r]
			},];
		
		fleurbot.botAction.next = na;
		return true;
	} else {
		return false;
	}
}

/* ==Input Triggers A Precise Action== 
	- input == one of the fleurbot.data.triggers[] phrases.
*/
fleurbot.isTrigger = function() {
	//return;
	var b = false;
	var keys = Object.keys(fleurbot.data.triggers);
	
	var i = 0;
	for(i=0;i<keys.length;i++){
		if(fleurbot.userInput.format == keys[i]) {
			var ta = fleurbot.data.triggers[fleurbot.userInput.format];
			fleurbot.botAction.next = fleurbot.getAction(ta);
			b = true;
			break;
		}
	}
	return b;
}

/* ==Input Include A Set Of Keywords== 
	- input matches a set of fleurbot.data.keywords[]
*/
fleurbot.includeKey = function() {
	
	var b = false;
	var act_nb = -1;
	var best = 0;
	
	var i = 0;
	for(i in fleurbot.data.keywords){
		var nb = fleurbot.compareSet(fleurbot.data.keywords[i],fleurbot.userInput.list);
		if(nb<0.5){nb=0.0;}
		if(nb>best){act_nb=i;best=nb;}
	}
	if (best == 0){return false;}
	fleurbot.botAction.next = fleurbot.getAction(fleurbot.data.keywords[act_nb].action);
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
fleurbot.compareSet = function(base,arr){
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
				//console.log("checkList in keylist - " + base.action);
				if(fleurbot.iterateCheckList(b_w,in_w)){
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
				//console.log('function in keylist - ' + base.action);
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
	return p;
}

fleurbot.iterateCheckList = function(chklist,word) {
	var warr = chklist.words;
	var i = 0;
	var a = 0;	
	if(warr.includes(word)){
		fleurbot.userInput.checks[chklist.id] = word;
		return true;
	}
	if(chklist.needed){return false;}
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
fleurbot.isAnswer = function() {
	if (!fleurbot.answer.branches)
		return false;
		
	var i = 0;
	for (i in fleurbot.answer.branches) {
		var branch = fleurbot.answer.branches[i];
		branch.any = true;
		if (branch.words) {
			var nb = fleurbot.compareSet(branch,fleurbot.userInput.list);
			if(nb >= 0.5) {
				fleurbot.botAction.next = getAction(branch.action);
				break;
			}
		} else {
			fleurbot.botAction.next = getAction(branch.action);
			break;
		}
	}
	if(!fleurbot.answer.wait){
		fleurbot.answer = {};
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
fleurbot.stripString = function(v) {
	fleurbot.userInput.isQuestion = v.includes('?');
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
fleurbot.inputState = function(v) {
	fleurbot.textInput.disabled = !v;
	if (v)
		fleurbot.textInput.focus();
}

/* ==Process All Actions== 
	- set delay depending on the text.length before executing an action.
*/
fleurbot.processAllActions = function() {
	
	fleurbot.showWriting();
	
	var time = 500;
	var na = fleurbot.botAction.next;
		
	var fn = function(v,end){
		return function(){
			fleurbot.hideWriting();
			if(fleurbot.doAction(v)){
				fleurbot.showWriting();
			} else {
				fleurbot.inputState(true);
				fleurbot.botAction.last = fleurbot.botAction.next;
				fleurbot.botAction.next = [];
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
fleurbot.doAction = function(i) {
	var a = fleurbot.botAction.next[i];
	
	fleurbot.botAction.currentAutor = fleurbot.botAction.lastAutor;
	
	if (a.autor && fleurbot.botAction.currentAutor != a.autor)
		fleurbot.botAction.currentAutor = a.autor
	
	if(a.text)
		fleurbot.drawNewPost(fleurbot.botAction.currentAutor,a.text);
	
	if(a.answer)
		fleurbot.answer = a.answer;
	
	if (a.fn)
		a.fn();
	
	return fleurbot.botAction.next[i+1] ? true : false;
}

/* ==Set & Get The User Informations== 
	- check for localStorage
		- if found, set or get user color & avatar.
		- if not found set user color & avatar randomly.
*/
fleurbot.setUserColor = function() {
	if (typeof(Storage) !== "undefined") {
		if (localStorage.color) {
			//fleurbot.data.characters.user.avatar = localStorage.avatar;
			fleurbot.data.characters.user.color = localStorage.color;
		} else {
			var col = fleurbot.randColor();
			//var r = Math.random() < 0.5 ? 1 : 2;
	    	//localStorage.setItem("avatar", "frog" + r + ".png");
	    	localStorage.setItem("color", col);
			//fleurbot.data.characters.user.avatar = localStorage.avatar;
			fleurbot.data.characters.user.color = localStorage.color;
		}
	} else {
		fleurbot.data.characters.user.color = randColor();
		//var rnd = Math.random() < 0.5 ? 1 : 2;
		//fleurbot.data.characters.user.avatar = "frog" + rnd + ".png";
	}
	//textInput.parentNode.style.backgroundColor = fleurbot.data.characters.user.color;
}
fleurbot.setUserColor();

/* ==Return A Random Color As A String== 
	- range is [100-255] for each canals
*/
fleurbot.randColor = function(){
	var r = Math.floor(Math.random() * 155)+100;
	var g = Math.floor(Math.random() * 155)+100;
	var b = Math.floor(Math.random() * 155)+100;
	var col = "rgb(" + r + "," + g + "," + b + ")";
	return col;
}

/* ==Scroll The 'chatbox' To The End== */
fleurbot.scrollToEnd = function() {
	window.scrollTo(0,fleurbot.chatBox.scrollHeight);
}

/* ==Show The 'is writing' Image== */
fleurbot.showWriting = function() {
	fleurbot.chatBox.appendChild(fleurbot.data.writing);
	fleurbot.scrollToEnd();
}

/* ==Hide The 'is writing' Image== */
fleurbot.hideWriting = function() {
	var w = document.querySelector('.fbot_writing');
	if(w){w.parentNode.removeChild(w);}
}

/* ==Get The Next Action==
	- a string will return 'fleurbot.data.actions[string]'
	- a function will return a empty action containnig the function.
	- an object will be returned as an action.
*/
fleurbot.getAction = function(v) {
	
	if (typeof(v) == "object"){
		return v;
		
	} else if (typeof(v) == "function"){
		var nafn = [{fn:v}];
		return nafn;
		
	} else if (typeof(v) == "string"){
		var nast = fleurbot.data.actions[v];
		return nast;
		
	} else {
		// default => return an empty action
		var nano = [{fn:function(){return;}}];
		return nano;
	}	
}


fleurbot.formatToQuery = function(match,qry){
	//console.log("The Query Is: " + qry);
	var s = qry
	s = qry.replace(/ /,"&20");
	s = qry.replace(/,/,"%2C");
	//s = qry.replace(/?/,"%3F");
	s = qry.replace(/#/,"%23");
	s = qry.replace(/=/,"%3D");
	return s
}

fleurbot.convertLink = function(match,url,lnk){
	//console.log("The Link Is: " + url);
	var string = "<a href=\"" + url + "\" target=_blank>" + lnk + "</a>"
	return string
}

fleurbot.checkMatch = function(match,id){
	//console.log("The Check Result Is: " + id);
	var s = id.replace(/##/,"");
	return fleurbot.userInput.checks[s] ? fleurbot.userInput.checks[s] : "";
}

/* ==Fire A Given Action==
	- 'act' can be :
		- a string refering to an fleurbot.data.actions[xx]
		- an object containing an action
		- a function
*/
fleurbot.fireAction = function(act) {
	fleurbot.inputState(false);
	fleurbot.botAction.next = fleurbot.getAction(act);
	fleurbot.processAllActions();
}

fleurbot.setup = function(){
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
	ftext.addEventListener("keypress", fleurbot.submitToBot);
	finput.appendChild(ftext);
	var fsend = document.createElement("div");
	fsend.id = "fbotsend";
	fsend.onclick = function(){fleurbot.submitToBot()};
	fsend.innerHTML = "Send";
	finput.appendChild(fsend);
	fdiv.appendChild(finput);
}
fleurbot.setup();
fleurbot.setup = null;


//////////////////////////////////////////////////////////////////////////////
//							HTML DOM ELEMENTS								//
//////////////////////////////////////////////////////////////////////////////

/* The Input Field */
fleurbot.textInput = document.getElementById('fbottextarea');

/* The Div Containing The Messages */
fleurbot.chatBox = document.getElementById('fbotmessages');

/* The 'is writing' Image (className = "writing" ) */
/* var writing = document.createElement('img');
writing.src = "loading.gif";
writing.className = "fbot_writing"; */