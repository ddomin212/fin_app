from flask import Blueprint
import json
from flask import request, jsonify
from datetime import datetime, timedelta, timezone
import re
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager

auth = Blueprint('auth', __name__)

@auth.route("/logout", methods=["GET"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@auth.after_request
def refresh_expiring_jwts(response):
    try:
        expirate_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > expirate_timestamp:
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
def create_jwt_token():
    from app import bcrypt, User
    
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    matching_user_email = User.query.filter_by(username=email).first()
    hashed_password = bcrypt.check_password_hash(matching_user_email.password, password)
    if not matching_user_email or not hashed_password:  # compare hashed password with database
        return {"msg": "Wrong email or password"}, 401
    
    access_token = create_access_token(identity=email)
    return {"access_token": access_token}


@auth.route('/register', methods=["POST"])
def register_user():
    from app import bcrypt, db, User

    email = request.json.get("email", None)
    if not re.fullmatch(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', email):
        return {"msg": "Email doesn't match regexp"}, 400
    
    hashed_password = bcrypt.generate_password_hash(
        request.json.get("password", None)
    )
    new_user = User(username=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()
    return {"msg": "Nice email you got there"}, 200