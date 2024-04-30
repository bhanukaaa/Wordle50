# Wordle50

## Description

Wordle50 is my version of the popular web-game wordle, which was also made using C in CS50x's Problem Set 2.
The whole web app uses multiple technologies learnt throughout CS50, and knowledge gained by further pursuing those languages.

## Languages, Libraries and Markup Languages Used
- Flask
- JavaScript
- Python
- HTML
- CSS
- Jinja
- SQL

## Introduction

Inspired by Problem Set 2, my own take on this game was created.

## How it works

* The game works by randomly selecting a word from an external dictionary of words, and by listening to the users keystrokes, and filling in a grid of cells.

* Upon hitting enter, each letter in the current row, is compared with the hidden word, and is given either an 'absent', 'present' or 'correct' class to help user deduce the final word.

* Upon every time a valid word is checked, the winHandler function will check for matches with the hidden word and handle the HTML body changes in the event of a Win or Loss.

* The game also uses an XML HTTP Request that I got help with on StackOverflow to help me solve the problem of sending data to flask without using a form.

* Flask handles all the SQL and Jinja data, to allow the Leaderboard to function.

* For SQL side of things I needed three tables in wordle50.db to allow the web app to function.
    - a users table: to handle the logging in, registering and foreign keys for the other tables.
    - an lbtotal table: to handle the Total Game Leaderboard's Total Wins counter, and total points.
    - an lbsingle table: to handle the Single Game Leaderboard's most points within a single game.

## What individual files do

* All dict.js files contain a dictionary of words of the given word length

* All game.js files contain the actual JavaScript code that makes the game word

* All play.html files contain the actual HTML structure for each version of the game to run

Note that the above 3 files have 3 versions each, one for all 3 versions of the game

* The styles.css file defines the styles for all the HTML structures and animations as well as the cell properties and classes needed for the game

* The app.py contains the Flask app and the SQL code that makes the actual web app run, and helpers.py is from CS50 Finance

* wordle50.db contains the SQL database

* The other HTML pages and images within the static folder are self explainatory

## Help recieved

* I used ChatGPT to create the list of words for the 4 and 6 letter versions of the game as there was no publicly available list of words made for wordle of that length.
But as I ran into the problem of all ChatGPT's words not being the correct length, I had to build error handling to actually check the length of the word before starting the game.

* As mentioned under how it works;
The XML HTTP requests were learnt seperately to handle sending data to flask.

* CS50's Finance Problem, was heavy inspiration onto the core layouts and design of the web app.

* I used Youtube and [Scrimba](https://scrimba.com) to learn CSS and JavaScript.

