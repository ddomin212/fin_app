from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity,jwt_required

stats = Blueprint('stats', __name__)

@stats.route('/watchList')
@jwt_required()
def watchList():
    from app import User

    user_holding = User.query.filter_by(username=get_jwt_identity()).first()
    return user_holding.watchlist, 200


@stats.route('/updateWatchList', methods=["POST"])
@jwt_required()
def updateWatchList():
    from app import User, db

    act_user = User.query.filter_by(username=get_jwt_identity()).first()
    act_user.watchlist = request.json.get("update", None)
    db.session.commit()
    return {"msg": "We happy Vincent."}, 200


@stats.route('/credit')
@jwt_required()
def credit():
    from app import User

    user_holding = User.query.filter_by(username=get_jwt_identity()).first()
    return str(user_holding.credit)


@stats.route('/updateCredit', methods=["POST"])
@jwt_required()
def updateCredit():
    from app import User, db

    act_user = User.query.filter_by(username=get_jwt_identity()).first()
    total = float(request.json.get("price", None)) * \
        int(request.json.get("amount", None))
    if act_user.credit - total < 0:
        return {"msg": "Not enough funds"}, 400
    else:
        act_user.credit -= total
    db.session.commit()

    return {"msg": "We happy Vincent."}, 200