![fleurbot-logo](/icons/128.png?raw=true)
# FleurBot.js

FleurBot is a browser-based chat system with a Bot. [Examples here](https://fleurman.neocities.org/fleurbot/index.html)

## The System
>TODO: html & css canvas

## The DataBase

### Var botData
contain all matching patterns, actions and characters datas.

#### Characters
This hash handles the characters informations. Each characters need the parameters "name" & "avatar".

`botData.characters = {
    user : {
    name : "The name to display",
    avatar : "The picture"
    }
}`

#### Vocab
This hash contain lists of words that can be referred to with the function getVocab("id").

`botData.vocab = {
	hello : ["hello","hi","ciao","hey","good morning","good evening",],
}`

#### Keywords
This array contain the matching patterns that uses arrays of words.

#### Triggers
A trigger refers to a specific phrase to match.
the key is the exact (formatted) phrase to match,
the value is the action:

#### Generic
This array contain actions that are randomly executed if 
the user input didn't match any patterns or if it is a repetition.

`botData.Generic = {
	none : [ actions ],
	repeat: [ actions ]
}`

#### Actions
An action represents the Bot behaviour. It can be a post, a function or a question.

- autor: (string) the character that will execute this action
- text: (string) post a new text on the chat.
- delay: (integer) delay in millieconds before processing the action.
- fn: (function) a function to execute with the action.
- answer: (answerList) start a "wait for answer" state.


### Classes

##### checkList(id ,words ,needed=false )
used to pick a word from a list. The matching word can be referred to with "##id".

- id: (string) used to refer to the matched word
- words: (array) the array of words
- needed: (boolean) if true, the whole matching pattern will be false if no word from this checkList is found.

##### keyList(action, words, any=false)
used to define a set of words to match for executing an action.

- action: (string|array) the action to execute if the keyList is validated.
- words: (array) the array of words
- any: (boolean) if true, any matching word will validate the keyList.

##### answerList(branches, wait=false)
used to define answers branches.

- branches: (hash|keyList) each branch must contain an "action:" & "words:"
- wait: (boolean) if true, the Bot will wait until the user input matchs any of the branches.


### Syntax tools
for any action text, a few tools are available:
- `\qt` ("quote") refers to the last user input
- `\fqt` ("formated quote") refers to the last user input formated for query
- `##id` ("matched") refers to the last matched string in checkList named "id"
- `[url](str)` ("link") displays a hyperlink. (will be opened in a new tab)


