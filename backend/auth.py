from flask import Blueprint
import json
from flask import request, jsonify
from datetime import datetime, timedelta, timezone
import re
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager

auth = Blueprint('auth', __name__)

@auth.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@auth.after_request
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


@auth.route('/token', methods=["POST"])
def create_token():
    from app import bcrypt, User
    
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    valid_email = User.query.filter_by(username=email).first()
    hashpass = bcrypt.check_password_hash(valid_email.password, password)
    if not valid_email or not hashpass:  # compare hashed password with database
        return {"msg": "Wrong email or password"}, 401
    access_token = create_access_token(identity=email)
    response = {"access_token": access_token}
    return response


@auth.route('/register', methods=["POST"])
def register():
    from app import bcrypt, db, User

    email = request.json.get("email", None)
    if not re.fullmatch(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', email):
        return {"msg": "Email doesn't match regexp"}, 404
    hashed_password = bcrypt.generate_password_hash(
        request.json.get("password", None)
    )
    new_user = User(username=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return {"msg": "Nice email you got there"}, 200