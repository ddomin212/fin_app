from auth import auth
from stats import stats
from stocks import stocks
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_cors import CORS
from datetime import timedelta
import os
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

load_dotenv()

def register_blueprints(app):
    app.register_blueprint(auth)
    app.register_blueprint(stats)
    app.register_blueprint(stocks)
    return app

def initialize_app():
    app = Flask(__name__)
    CORS(app)
    bcrypt = Bcrypt(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    db = SQLAlchemy(app)
    app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["SECRET_KEY"] =  os.getenv("SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=int(os.getenv("TIMEDELTA")))

    jwt = JWTManager(app)

    return app, db, bcrypt, jwt