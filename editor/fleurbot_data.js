var fleurbot = {}

checkList=function(i,w,n){var obj={id:i,words:w,};if(n!=="undefined"){obj.needed=n;}return obj;}
keyList=function(act,w,an){var obj={};if(act!=="undefined"){obj.action=act;}if(w!=="undefined"){obj.words=w;}if(an!=="undefined"){obj.any=an;}return obj;}
answerList=function(b,w){var obj={branches:b};if(w!=="undefined"){obj.wait=w;}return obj;}

getVocab=function(id){if(fleurbot.data)return fleurbot.data.vocab[id];}

fleurbot.data={
	"vocab": [
		{
			"name":"salute",
			"type":"words",
			"value":["hi","hello","ciao"]
		},
		{
			"name":"is a number",
			"type":"function",
			"value":"return(input==Number(input))"
		}
	],
		
	"triggers": [
		{
			"value":"how are you doing",
			"type":"words",
			"action":"hello"
		}
	],
	
	"keywords": [
		{	
			"name":"Test",
			"action":"hello",
			"value":[],
			"any":true
		}
	],
	
	"actions": {
		"hello":[
			{
				"autor":"bot",
				"text":"hello"
			}
		]
	},
	
	"generic": {
		"repeat":[""],
		"none":[""]
	},
	
	"characters": {
		"user": {
			"name":"User",
			"avatar":"",
			"color":"rgb(240,180,234)"
		},
		"bot": {
			"name":"Bot",
			"avatar":"",
			"color":"gold"
		}
	},
	
	"writing":{}
}


fleurbot.data.writing = document.createElement('img');
fleurbot.data.writing.src = "loading.gif";
fleurbot.data.writing.className = "fbot_writing";