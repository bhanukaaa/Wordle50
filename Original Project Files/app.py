import os
import time

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Connect to database
db = SQL("sqlite:///wordle50.db")

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return redirect("/")

        # Ensure password was submitted
        elif not request.form.get("password"):
            return redirect("/")

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return redirect("/")

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # getting inputs
        username = request.form.get("username")
        password = request.form.get("password")
        rpassword = request.form.get("confirmation")
        # getting list incase any matching exisiting usernames
        rows = db.execute("SELECT * FROM users WHERE username = ?", username)
        # checking inputs
        if not username:
            return redirect("/register")
        if not password:
            return redirect("/register")
        if not rpassword:
            return redirect("/register")
        if password != rpassword:
            return redirect("/register")
        try:
            if username in rows[0]["username"]:
                return redirect("/register")
        except IndexError:
            # establishing user
            db.execute("INSERT INTO users (username, hash) VALUES (?, ?)", username, generate_password_hash(password))
        return redirect("/")
    else:
        # sending to form
        return render_template("register.html")


@app.route("/play5", methods=["GET", "POST"])
def play5():
    userID = session["user_id"]
    return render_template("play5.html")


@app.route("/play4", methods=["GET", "POST"])
def play4():
    userID = session["user_id"]
    return render_template("play4.html")


@app.route("/play6", methods=["GET", "POST"])
def play6():
    userID = session["user_id"]
    return render_template("play6.html")


@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.get_json()
    points = data.get('points')

    userID = session["user_id"]
    row = db.execute("SELECT * FROM users WHERE id = ?", userID)
    username = row[0]["username"]

    # Updating Total Points Leaderboard
    check = db.execute("SELECT * FROM lbtotal WHERE username = ?", username)
    if check:
        db.execute("UPDATE lbtotal SET totalpoints = ? WHERE username = ?", check[0]["totalpoints"]+points, username)
        db.execute("UPDATE lbtotal SET games = ? WHERE username = ?", check[0]["games"] + 1, username)
    else:
        db.execute("INSERT INTO lbtotal (username, totalpoints, games) VALUES (?, ?, 1)", username, points)

    # Updating Single Game Leaderboard
    db.execute("INSERT INTO lbsingle (username, points) VALUES (?, ?)", username, points)
    return redirect("/leaderboard")


@app.route("/leaderboard", methods=["GET", "POST"])
def leaderboard():
    lb = db.execute("SELECT * FROM lbtotal ORDER BY totalpoints DESC LIMIT 15")
    sg = db.execute("SELECT * FROM lbsingle ORDER BY points DESC LIMIT 15")
    return render_template("leaderboard.html", lb=lb, sg=sg)

