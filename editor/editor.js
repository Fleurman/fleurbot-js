/*==================================================================================
									VARIABLES
==================================================================================*/
var iframe = document.getElementById("iframe");
var tabs = document.querySelectorAll(".tab")
var pages = document.querySelectorAll(".page")
var vocabList = pages[1].querySelector(".items");
var triggersList = pages[2].querySelector(".items");
var keywordsList = pages[3].querySelector(".items");
var currentPage = 0;
var currentItem = 0;
var newVocabCount = 1;
var newKeywordsCount = 1;

/*==================================================================================
								PAGE NAVIGATION
==================================================================================*/
function selectTab(id,hash) {
	currentPage = id;
	var i = 0;
	for(i in tabs){
		tabs[i].className = "tab";
		pages[i].className = "page";
	}
	tabs[id].className = "tab active";
	pages[id].className = "page active";
	setPage(hash);
}

/*==================================================================================
								LISTS METHODS
==================================================================================*/
function selectItem(el) {
	var litms = pages[currentPage].querySelectorAll(".item");
	var i = 0;
	for(i in litms){
		if (litms[i] == el) {el.className = "item active"; currentItem=i;
		} else {litms[i].className = "item";}
	}
	if(currentPage==1){vocabInputState(true);}
	if(currentPage==3){keywordsInputState(true);}
}

function deleteItem() {
	var litms = pages[currentPage].querySelectorAll(".item");
	var i = 0;
	for(i in litms){
		if (litms[i].className == "item active")
			litms[i].remove();
	}
}

function selectedItem(key) {
	var id = 0;
	var pro = true;
	var item;
	switch(key){
		case "trigger": item=triggersList; break; 
		case "vocab": item=vocabList; break; 
		case "keywords": item=keywordsList; break; 
		default:}
	while(pro == true){
		var c = item.children[id];
		if(c.className.includes("active")){ pro = false; } else {id += 1;}
		if(!item.children[id]){pro = false;}
	}
	return id;
}

/*==================================================================================
								TRIGGERS METHODS
==================================================================================*/

/*-------------------------------------------
				TRIGGERS ITEMS
---------------------------------------------*/

function createNewTriggerItem(value,type,action){
	var d = document.createElement('div');
	d.className = "item";
	d.onclick = function () {selectItem(d);};
	var vel = document.createElement("input");
	vel.type = "text";
	vel.className = "triggervalue";
	vel.name = "triggervalue";
	vel.value = value;
	var tel = document.createElement("select");
	tel.className = "triggertype";
	addOptionTo(tel,"words");
	addOptionTo(tel,"function");
	selectOption(tel,type);
	var ael = document.createElement("select");
	ael.className = "action";
	addOptionTo(ael,"none");
	addAllActionsIn(ael);
	selectOption(ael,action);
	d.innerHTML += "Value:";
	d.appendChild(vel);
	d.innerHTML += "<br/>Type:";
	d.appendChild(tel);
	d.innerHTML += "Action:";
	d.appendChild(ael);
	return d;
}

function selectedTriggerItem() {
	var id = 0;
	var pro = true;
	while(pro == true){
		var c = triggersList.children[id];
		if(c.className.includes("active")){ pro = false; } else {id += 1;}
		if(!triggersList.children[id]){pro = false;}
	}
	return id;
}

function newTriggerItem() {
	newTriggerData();
	var d = createNewTriggerItem();
	triggersList.appendChild(d);
	var val = d.querySelector(".triggervalue");
	val.onchange = function(){setTriggerValue(val.value);};
	var typ = d.querySelector(".triggertype");
	typ.onchange = function(){setTriggerType(typ.value);};
	var act = d.querySelector(".action");
	act.onchange = function(){setTriggerAction(act.value);};
	selectItem(d);
}

function deleteTriggerItem() {
	deleteTriggerData(selectedTriggerItem());
	deleteItem();
}

/*-------------------------------------------
				TRIGGERS DATA
---------------------------------------------*/
function newTriggerData() {
	fleurbot.data.triggers.push({value:"",type:"words",action:""});
}
function deleteTriggerData(id) {
	fleurbot.data.triggers.splice(id,1);
}
function setTriggerData(value,type,action) {
	var id = selectedTriggerItem();
	fleurbot.data.triggers[id].value = value;
	fleurbot.data.triggers[id].type = type;
	fleurbot.data.triggers[id].action = action;
}
function setTriggerValue(value) {
	fleurbot.data.triggers[selectedTriggerItem()].value = value;
}
function setTriggerType(type) {
	fleurbot.data.triggers[selectedTriggerItem()].type = type;
}
function setTriggerAction(action) {
	fleurbot.data.triggers[selectedTriggerItem()].action = action;
}


/*==================================================================================
								VOCAB METHODS
==================================================================================*/

/*-------------------------------------------
				 VOCAB ITEMS
---------------------------------------------*/
function newVocabName() {
	return "Voc " + newVocabCount++;
}

function newVocabItem() {
	var name =  newVocabName();
	newVocabData(name);
	d = createNewVocabItem(name);
	vocabList.appendChild(d);
	refreshBackupList();
	d.click();
}

function setVocabItemName(value){
	var id = selectedItem("vocab");
	vocabList.children[id].innerHTML = value;
}

function createNewVocabItem(name) {
	var d = document.createElement('div');
	d.className = "item";
	d.innerHTML = name;
	d.onclick = function () {
		selectItem(d);
		displayVocabData();
		};
	return d;
}

function deleteVocabItem() {
	deleteData("vocab",selectedItem("vocab"));
	deleteItem();
	vocabInputState(false);
	refreshBackupList();
}

/*-------------------------------------------
				 VOCAB GUI
---------------------------------------------*/

function displayVocabData() {
	var id = selectedItem("vocab");
	var nam	= pages[1].querySelector("#vocabname");
	nam.value = fleurbot.data.vocab[id].name;
	var typ	= pages[1].querySelector("#vocabtype");
	typ.value = fleurbot.data.vocab[id].type;
	functionTipsState(typ.value=="function");
	linkBackState(typ.value=="link");
	var val	= pages[1].querySelector("#vocabvalue");
	val.value = fleurbot.data.vocab[id].value;
	if(fleurbot.data.vocab[id].backup){
		var lin	= pages[1].querySelector("#vocablink");
		lin.value = fleurbot.data.vocab[id].backup;
	}
}

function emptyVocabDisplay() {
	var nam	= pages[1].querySelector("#vocabname");
	nam.value = "";
	var typ	= pages[1].querySelector("#vocabtype");
	typ.value = "";
	var val	= pages[1].querySelector("#vocabvalue");
	val.value = "";
}

function vocabInputState(bool){
	if(!bool){emptyVocabDisplay();}
	pages[1].querySelector("#vocabname").disabled = !bool;
	pages[1].querySelector("#vocabtype").disabled = !bool;
	pages[1].querySelector("#vocabvalue").disabled = !bool;
}

/*-------------------------------------------
				 VOCAB DATA
---------------------------------------------*/
function newVocabData(name){
	fleurbot.data.vocab.push({name:name,type:"words",value:""});
}

function parseVocabValue(type,value) {
	var nv;
	if(type=="words"){
		nv = value.split(",")
	} else {
		nv = value;
	}
	return nv;
}

function displayData() {
	var str = JSON.stringify(fleurbot.data);
	 document.getElementById("exportdata").innerHTML = str;
}

var refreshdata = document.getElementById("refreshdata");
refreshdata.onclick = displayData;

function selectData() {
	var el = document.getElementById("exportdata");
	el.select();
}

var selectdata = document.getElementById("selectdata");
selectdata.onclick = selectData;

function getFleurBot() {
	var str = "fleurbot = "
	str += JSON.stringify(fleurbot);
	var opened = window.open("");
	opened.document.write(str);
}

var getfleubot = document.getElementById("getfleurbot");
getfleurbot.onclick = getFleurBot;

/*==================================================================================
								KEYWORDS METHODS
==================================================================================*/

/*-------------------------------------------
			    KEYWORDS ITEMS
---------------------------------------------*/
function newKeywordsName() {
	return "Voc " + newKeywordsCount++;
}

function newKeywordsItem() {
	var name = newKeywordsName();
	newKeywordsData(name);
	d = createNewKeywordsItem(name);
	keywordsList.appendChild(d);
	refreshBackupList();
	d.click();
}

function setKeywordsItemName(value){
	var id = selectedItem("keywords");
	keywordsList.children[id].innerHTML = value;
}

function createNewKeywordsItem(name) {
	var d = document.createElement('div');
	d.className = "item";
	d.innerHTML = name;
	d.onclick = function () {
		selectItem(d);
		displayKeywordsData();
		};
	return d;
}

function deleteKeywordsItem() {
	deleteData("keywords",selectedItem("keywords"));
	deleteItem();
	keywordsInputState(false);
}

/*-------------------------------------------
				KEYWORDS GUI
---------------------------------------------*/

function displayKeywordsData() {
	var id = selectedItem("keywords");
	var nam	= pages[3].querySelector("#keyname");
	nam.value = fleurbot.data.keywords[id].name;
	var any	= pages[3].querySelector("#keyany");
	any.checked = fleurbot.data.keywords[id].any;
	var act	= pages[3].querySelector("#keyaction");
	act.value = fleurbot.data.keywords[id].action;
}

function emptyKeywordsDisplay() {
	var nam	= pages[3].querySelector("#keyname");
	nam.value = "";
	var any	= pages[3].querySelector("#keyany");
	any.checked = false;
	var act	= pages[3].querySelector("#keyaction");
	act.value = "";
}

function keywordsInputState(bool){
	if(!bool){emptyKeywordsDisplay();}
	pages[3].querySelector("#keyname").disabled = !bool;
	pages[3].querySelector("#keyany").disabled = !bool;
	pages[3].querySelector("#keyaction").disabled = !bool;
	pages[3].querySelector("#keyvalue").className = bool ? "" : "inactive";
	pages[3].querySelector("#keybuttons").className = bool ? "" : "inactive";
}

/*-------------------------------------------
				 KEYWORDS DATA
---------------------------------------------*/
function newKeywordsData(name){fleurbot.data.keywords.push({name:name,any:false,action:"none",value:[]});}


/*==================================================================================
								DATA METHODS
==================================================================================*/

function setData(key,sub,value) {
	var id = currentItem;//selectedItem(key);
	fleurbot.data[key][id][sub] = value;
}
function setDataAt(key,id,sub,value) {
	var id = selectedItem(key);
	fleurbot.data[key][id][sub] = value;
}
function deleteData(key,id) {
	fleurbot.data[key].splice(id,1);
}
function newData(key) {
	switch(key){
		case "trigger":
			fleurbot.data.triggers.push({value:"",type:"words",action:""});
			break;
		case "vocab":
			fleurbot.data.vocab.push({name:"",type:"words",value:""});
			break;
		case "keyword":
			fleurbot.data.keywords.push({name:"",any:false,action:"",value:[]});
			break;
		case "action":
			fleurbot.data.actions.push({name:"",value:[]});
			break;
		case "characters":
			fleurbot.data.characters.push({name:"",avatar:"",color:""});
			break;
		default:
			alert("Unknown data key: " + key);
	}
}

/*==================================================================================
								GUI METHODS
==================================================================================*/

function addOptionTo(el,value){
	var o = document.createElement("option");
	o.value = value;
	o.innerHTML = value;
	el.appendChild(o);
}

function selectOption(el,option) {
	for (i in el.options) {
		var o = el.options[i];
		if (o.value === option) {
			o.selected = true;
		}
	}
}

function currentList(){return  pages[currentPage].querySelectorAll(".item");}
function functips(){return  pages[currentPage].querySelectorAll(".functips");}

function functionTipsState(bool){
	var tips = functips();
	var value = bool ? "block" : "none";
	var i=0;
	for(i=0;i<tips.length;i++){
		tips[i].style.display = value;
	}
}
function linkBackState(bool){
	var tip = document.getElementById("vocablinkcont");
	tip.style.display = bool ? "block" : "none";
}

function refreshBackupList() {
	var el = document.getElementById("vocablink");
	updateVocabList(el);
}

function updateVocabList(el) {
	el.innerHTML = `<option value="none" label="None"></option>`;
	addAllVocabIn(el);
}

function updateAllActionsLists() {
	var lists = document.querySelectorAll(".action");
	var i = 0;
	for(i=0;i<lists.length;i++) {
		var el = lists[i];
		el.innerHTML = `<option value="none" label="None"></option>`;
		addAllActionsIn(el);
	}
}

function addActionInLists(name) {
	var lists = document.querySelectorAll(".action");
	var i = 0;
	for(i=0;i<lists.length;i++) {
		var option = document.createElement("option");
		option.value = name;
		option.innerHTML = name;
		lists[i].appendChild(option);
	}
}

function deleteActionInLists(name) {
	var lists = document.querySelectorAll(".action");
	var i = 0;
	for(i=0;i<lists.length;i++) {
		var el = lists[i].querySelector("[name="+name+"]");
		if(el){document.remove(el);}
	}
}

function addAllActionsIn(el){
	for(i in fleurbot.data.actions){
		if(i=="length"){return;}
		var option = document.createElement("option");
		option.value = i;
		option.innerHTML = i;
		el.appendChild(option);
	}
}

function addAllVocabIn(el){
	var i = 0;
	for(i=0;i<fleurbot.data.vocab.length;i++){
		var v = fleurbot.data.vocab[i].name;
		var option = document.createElement("option");
		option.value = v;
		option.innerHTML = v;
		el.appendChild(option);
	}
}

function setPage(hash) {
	var ch = "#" + hash;
	if(document.location.hash != ch) {
		document.location.hash = hash;
		loadPage();
	}
}

function loadPage() {
	var myHash = document.location.hash;
	var sl = "";
	if(myHash) {
		sl = myHash.replace(/[#]/g, "");
	} else {
		sl = "home";
		document.location.hash = "home";
	}
	var dat = {"home":"tabtuto","vocab":"tabvocab","triggers":"tabtriggers",		// RENAME PAGES !!
	"keywords":"tabkeywords","actions":"tabactions","data":"tabexport"}
	var el = document.getElementById(dat[sl]);
	el.click();
}

loadPage();

function importFromText(){
	var el = document.getElementById("exportdata");
	var obj = JSON.parse(el.value);
	importData(obj);
}

function importData(data){
	resetEditorValues();
	fleurbot.data = data;
	initEditorValues();
	
}

var importdata = document.getElementById("importdata");
importdata.onclick = importFromText;

/*==================================================================================
								INITIALIZATION
==================================================================================*/

function resetEditorValues(){
	vocabList.innerHTML = "";
	triggersList.innerHTML = "";
	keywordsList.innerHTML = "";
}

function initEditorValues(){
	initVocab();
	initTriggers();
	initKeywords();
}

function initTriggers(){
	var i = 0;
	var triggers = fleurbot.data.triggers;
	for(i=0;i<triggers.length;i++){
		var d = createNewTriggerItem(triggers[i].value,triggers[i].type,triggers[i].action);
		triggersList.appendChild(d);
		var val = d.querySelector(".triggervalue");
		val.value = triggers[i].value;
		val.onchange = function(){setTriggerValue(val.value);};
		var typ = d.querySelector(".triggertype");
		typ.onchange = function(){setTriggerType(typ.value);};
		var act = d.querySelector(".action");
		act.onchange = function(){setTriggerAction(act.value);};
	}
}
function initVocab(){
	var nam	= pages[1].querySelector("#vocabname");
	nam.onchange = function(){
		setData("vocab","name",nam.value);
		setVocabItemName(nam.value);
	};
	var typ	= pages[1].querySelector("#vocabtype");
	typ.onchange = function(){
		setData("vocab","type",typ.value);
		functionTipsState(typ.value=="function");
		linkBackState(typ.value=="link");
	};
	var val	= pages[1].querySelector("#vocabvalue");
	val.onchange = function(){
		var pv = parseVocabValue(typ.value,val.value)
		setData("vocab","value",pv);
	};
	var lin	= pages[1].querySelector("#vocablink");
	lin.onchange = function(){
		setData("vocab","link",lin.value);
	};
	addAllVocabIn(lin);
	
	var i = 0;
	var vocabs = fleurbot.data.vocab;
	for(i=0;i<vocabs.length;i++){
		var d = createNewVocabItem(vocabs[i].name);
		vocabList.appendChild(d);
	}
	vocabInputState(false);
}
function initKeywords(){
	var nam	= pages[3].querySelector("#keyname");
	nam.onchange = function(){
		setData("keywords","name",nam.value);
		setKeywordsItemName(nam.value);
	};
	var any	= pages[3].querySelector("#keyany");
	any.onchange = function(){
		setData("keywords","any",any.checked);
	};
	var act	= pages[3].querySelector("#keyaction");
	act.onchange = function(){
		setData("keywords","action",act.value);
	};
	addAllActionsIn(act);
	
	var i = 0;
	var keys = fleurbot.data.keywords;
	for(i=0;i<keys.length;i++){
		var d = createNewKeywordsItem(keys[i].name);
		keywordsList.appendChild(d);
	}
	keywordsInputState(false);
}

initEditorValues();

// Enable navigation prompt
//window.onbeforeunload=function(){return true;};