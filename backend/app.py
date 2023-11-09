import json
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
import re
import os
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
db = SQLAlchemy(app)
app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SECRET_KEY"] =  os.getenv("SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=int(os.getenv("TIMEDELTA")))

jwt = JWTManager(app)

#!CLASSES


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    holdings = db.Column(db.String(), default="")
    watchlist = db.Column(db.String(), default="")
    credit = db.Column(db.Integer, default=5000)

#!ROUTES


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original resposne
        return response


@app.route('/token', methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    valid_email = User.query.filter_by(username=email).first()
    hashpass = bcrypt.check_password_hash(valid_email.password, password)
    if not valid_email or not hashpass:  # compare hashed password with database
        return {"msg": "Wrong email or password"}, 401
    access_token = create_access_token(identity=email)
    response = {"access_token": access_token}
    return response


@app.route('/register', methods=["POST"])
def register():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if not re.fullmatch(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', email):
        return {"msg": "Email doesn't match regexp"}, 404
    hashed_password = bcrypt.generate_password_hash(
        request.json.get("password", None)
    )
    new_user = User(username=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return {"msg": "Nice email you got there"}, 200


@app.route('/stockBought')
@jwt_required()
def stockBought():
    user_holding = User.query.filter_by(username=get_jwt_identity()).first()
    return user_holding.holdings, 200


@app.route('/watchList')
@jwt_required()
def watchList():
    user_holding = User.query.filter_by(username=get_jwt_identity()).first()
    return user_holding.watchlist, 200


@app.route('/updateWatchList', methods=["POST"])
@jwt_required()
def updateWatchList():
    act_user = User.query.filter_by(username=get_jwt_identity()).first()
    act_user.watchlist = request.json.get("update", None)
    db.session.commit()
    return {"msg": "We happy Vincent."}, 200


@app.route('/credit')
@jwt_required()
def credit():
    user_holding = User.query.filter_by(username=get_jwt_identity()).first()
    return str(user_holding.credit)


@app.route('/updateCredit', methods=["POST"])
@jwt_required()
def updateCredit():
    act_user = User.query.filter_by(username=get_jwt_identity()).first()
    total = float(request.json.get("price", None)) * \
        int(request.json.get("amount", None))
    if act_user.credit - total < 0:
        return {"msg": "Not enough funds"}, 400
    else:
        act_user.credit -= total
    db.session.commit()

    return {"msg": "We happy Vincent."}, 200


@app.route('/buyStock', methods=["POST"])
@jwt_required()
def buyStock():
    act_user = User.query.filter_by(username=get_jwt_identity()).first()
    act_user.holdings = request.json.get("update", None)
    db.session.commit()
    return {"msg": "We happy Vincent."}, 200


@app.route('/sellStock', methods=["POST"])
@jwt_required()
def sellStock():
    act_user = User.query.filter_by(username=get_jwt_identity()).first()
    pattern = r'(?<=\"'+re.escape(request.json.get("symbol", None))+r'\":)\d*'
    if not request.json.get("symbol", None) in act_user.holdings:
        return {"msg": "cant sell stock you do not own"}, 400
    if request.json.get("quant", None) > re.findall(pattern, act_user.holdings)[0]:
        return {"msg": "cant sell stock you do not own"}, 400
    act_user.holdings = request.json.get("update", None)
    db.session.commit()
    return {"msg": "We happy Vincent."}, 200
