from flask import Flask, jsonify, request
from flask_cors import CORS
from logic import BlackjackLogic

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

game_logic = BlackjackLogic()

# Simple in-memory storage for game state
# In a production app, use sessions or a database
game_state = {
    "user_cards": [],
    "computer_cards": [],
    "is_game_over": True,
    "balance": 1000,
    "current_bet": 0
}

@app.route('/')
def home():
    return "Blackjack Backend is running! Use the API endpoints to play."

@app.route('/start', methods=['POST'])
def start_game():
    data = request.json
    bet = data.get('bet', 10)
    
    if bet > game_state["balance"]:
        return jsonify({"error": "Insufficient funds"}), 400

    game_state["current_bet"] = bet
    game_state["user_cards"] = [game_logic.deal_card(), game_logic.deal_card()]
    game_state["computer_cards"] = [game_logic.deal_card(), game_logic.deal_card()]
    game_state["is_game_over"] = False
    
    user_score = game_logic.calculate_score(game_state["user_cards"])
    computer_score = game_logic.calculate_score(game_state["computer_cards"])

    result = ""
    if user_score == 0 or computer_score == 0:
        game_state["is_game_over"] = True
        result = game_logic.compare(user_score, computer_score)
        # Handle immediate Blackjack outcomes
        if user_score == 0 and computer_score != 0:
            game_state["balance"] += int(bet * 1.5) # Blackjack pays 3:2
        elif computer_score == 0 and user_score != 0:
            game_state["balance"] -= bet
        # Draw (both 0) does nothing to balance

    return jsonify({
        "user_cards": game_state["user_cards"],
        "user_score": user_score,
        "computer_first_card": game_state["computer_cards"][0],
        "is_game_over": game_state["is_game_over"],
        "balance": game_state["balance"],
        "result": result
    })

@app.route('/hit', methods=['POST'])
def hit():
    if game_state["is_game_over"]:
        return jsonify({"error": "Game is already over"}), 400

    game_state["user_cards"].append(game_logic.deal_card())
    user_score = game_logic.calculate_score(game_state["user_cards"])

    result = ""
    if user_score > 21:
        game_state["is_game_over"] = True
        game_state["balance"] -= game_state["current_bet"]
        computer_score = game_logic.calculate_score(game_state["computer_cards"])
        result = game_logic.compare(user_score, computer_score)

    return jsonify({
        "user_cards": game_state["user_cards"],
        "user_score": user_score,
        "is_game_over": game_state["is_game_over"],
        "balance": game_state["balance"],
        "result": result
    })

@app.route('/stand', methods=['POST'])
def stand():
    if game_state["is_game_over"]:
        return jsonify({"error": "Game is already over"}), 400

    game_state["is_game_over"] = True
    
    # Dealer plays
    game_state["computer_cards"], computer_score = game_logic.dealer_play(game_state["computer_cards"])
    user_score = game_logic.calculate_score(game_state["user_cards"])

    result = game_logic.compare(user_score, computer_score)

    # Update balance based on result string (case-insensitive)
    res_lower = result.lower()
    if "win" in res_lower:
        if "blackjack" in res_lower:
            game_state["balance"] += int(game_state["current_bet"] * 1.5)
        else:
            game_state["balance"] += game_state["current_bet"]
    elif "lose" in res_lower or "over" in res_lower:
        game_state["balance"] -= game_state["current_bet"]
    # "draw" is ignored, leaving balance as is

    return jsonify({
        "user_cards": game_state["user_cards"],
        "user_score": user_score,
        "computer_cards": game_state["computer_cards"],
        "computer_score": computer_score,
        "result": result,
        "is_game_over": True,
        "balance": game_state["balance"]
    })

@app.route('/status', methods=['GET'])
def get_status():
    return jsonify(game_state)

if __name__ == '__main__':
    app.run(debug=True, port=5000)