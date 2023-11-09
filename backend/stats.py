from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity,jwt_required

stats = Blueprint('stats', __name__)

@stats.route('/watchList')
@jwt_required()
def watchList():
    from app import User

    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    if not current_user:
        return {"msg": "User not found"}, 404
    
    return current_user.watchlist, 200


@stats.route('/updateWatchList', methods=["POST"])
@jwt_required()
def updateWatchList():
    from app import User, db

    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    if not current_user:
        return {"msg": "User not found"}, 404
    
    current_user.watchlist = request.json.get("update", None)
    db.session.commit()
    return {"msg": "Item successfuly added to the watch list"}, 200


@stats.route('/credit')
@jwt_required()
def credit():
    from app import User

    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    if not current_user:
        return {"msg": "User not found"}, 404
    
    return str(current_user.credit)


@stats.route('/updateCredit', methods=["POST"])
@jwt_required()
def updateCredit():
    from app import User, db

    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    if not current_user:
        return {"msg": "User not found"}, 404
    
    total_price = float(request.json.get("price", None)) * \
        int(request.json.get("amount", None))
    if current_user.credit - total_price < 0:
        return {"msg": "Not enough funds"}, 400
    else:
        current_user.credit -= total_price
    db.session.commit()

    return {"msg": "Transaction successful"}, 200