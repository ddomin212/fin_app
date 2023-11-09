from flask_login import UserMixin
from initialize import register_blueprints, initialize_app

app, db, bcrypt, jwt  = initialize_app()

#!MODELS
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    holdings = db.Column(db.String(), default="")
    watchlist = db.Column(db.String(), default="")
    credit = db.Column(db.Integer, default=5000)

#!ROUTES
register_blueprints(app)



