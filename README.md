# 🃏 Online Blackjack Casino

A full-stack web implementation of the classic Blackjack game. This project features a robust Python backend handling game logic and state, paired with a polished, "casino-style" React frontend.

## 🚀 Features

*   **Real-time Game Logic**: Handles card dealing, score calculation (including Ace logic), and dealer AI.
*   **Betting System**: Includes a virtual wallet and interactive betting chips ($10, $50, $100, $500).
*   **Casino UI/UX**: A responsive "Green Felt" table design with overlapping cards and a results overlay.
*   **Dynamic Assets**: Supports real playing card images with automatic text fallbacks if assets are missing.
*   **State Persistence**: Tracks your balance across rounds during a single session.

---

## 🛠️ Project Structure

```text
Black Jack Game Online/
├── backend/            # Flask REST API
│   ├── app.py          # Server routes and state management
│   ├── logic.py        # Blackjack engine and scoring logic
│   └── requirements.txt
└── frontend/           # React + Vite UI
    ├── src/
    │   ├── App.jsx     # Main game component
    │   └── App.css     # Casino-themed styling
    └── public/         # Static assets (Card images)
```

---

## ⚙️ Setup Instructions

### 1. Backend (Python/Flask)
Navigate to the `backend` directory and install dependencies:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
*The server will start at `http://127.0.0.1:5000`.*

### 2. Frontend (React/Vite)
Open a new terminal, navigate to the `frontend` directory, and install dependencies:

```bash
cd frontend
npm install
npm run dev
```
*The UI will be accessible at `http://localhost:5173`.*

---

## 🎨 Adding Card Assets

To see real cards instead of text fallbacks, place your `.png` card images in the following directory:
`frontend/public/images/cards/`

**Naming Convention:**
*   `ace_of_clubs.png` (Value 11)
*   `2_of_clubs.png` ... `10_of_clubs.png`
*   `card_back.png` (For the dealer's hidden card)

---

## 🎮 How to Play

1.  **Place Your Bet**: Select a chip from the lobby and click **DEAL CARDS**.
2.  **Your Turn**: Choose to **Hit** (take another card) or **Stand** (keep your current hand).
3.  **Dealer's Turn**: If you Stand, the dealer will automatically play until they reach at least 17.
4.  **Outcome**:
    *   **Win**: You receive 1:1 on your bet (3:2 for a Blackjack).
    *   **Lose**: Your bet is deducted from your wallet.
    *   **Draw (Push)**: Your balance remains unchanged.

## 📝 License
MIT