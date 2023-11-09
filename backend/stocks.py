from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity,jwt_required
import re

stocks = Blueprint('stocks', __name__)

@stocks.route('/stockBought')
@jwt_required()
def stockBought():
    from app import User

    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    if not current_user:
        return {"msg": "User not found"}, 404
    
    return current_user.holdings, 200

@stocks.route('/buyStock', methods=["POST"])
@jwt_required()
def buyStock():
    from app import User, db

    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    if not current_user:
        return {"msg": "User not found"}, 404
    
    current_user.holdings = request.json.get("update", None)
    db.session.commit()
    return {"msg": "Sold successfuly."}, 200


@stocks.route('/sellStock', methods=["POST"])
@jwt_required()
def sellStock():
    from app import User, db

    current_user = User.query.filter_by(username=get_jwt_identity()).first()
    if not current_user:
        return {"msg": "User not found"}, 404
    
    pattern = r'(?<=\"'+re.escape(request.json.get("symbol", None))+r'\":)\d*'
    if not request.json.get("symbol", None) in current_user.holdings:
        return {"msg": "cant sell stock you do not own"}, 400
        
    if request.json.get("quant", None) > re.findall(pattern, current_user.holdings)[0]:
        return {"msg": "cant sell stock you do not own"}, 400
    
    current_user.holdings = request.json.get("update", None)
    db.session.commit()
    
    return {"msg": "Transaction successful."}, 200