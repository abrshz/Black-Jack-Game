import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://127.0.0.1:5000';

function App() {
  const [gameData, setGameData] = useState({
    user_cards: [],
    user_score: 0,
    computer_cards: [],
    computer_score: 0,
    computer_first_card: null,
    is_game_over: false,
    result: '',
    balance: 1000
  });

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [bet, setBet] = useState(10);
  const [shuffling, setShuffling] = useState(false);

  // Helper to map card value to display rank for image filenames
  const getCardRank = (value) => {
    if (value === 11 || value === 1) return 'ace';
    if (value === 10) return '10';
    return String(value);
  };

  // Card Component
  const Card = ({ value, isFaceDown = false }) => {
    if (value === undefined || (value === null && !isFaceDown)) return <div className="playing-card loading" />;

    const cardImage = isFaceDown
      ? '/images/cards/card_back.png'
      : `/images/cards/${getCardRank(value)}_of_clubs.png`; // Assuming 'clubs' as default suit

    return (
      <div className="playing-card">
        <img
          src={cardImage}
          alt={isFaceDown ? "Card Back" : getCardRank(value)}
          onError={(e) => {
            e.target.style.opacity = '0'; // Hide broken image
            e.target.nextSibling.style.display = 'block'; // Show fallback
          }}
        />
        <div className="card-fallback" style={{ display: 'none' }}>{isFaceDown ? "?" : getCardRank(value)}</div>
      </div>
    );
  };

  const startGame = async () => {
    if (shuffling) return; // Prevent multiple clicks during shuffle
    setShuffling(true);

    // Temporarily hide elements for shuffle animation
    setGameData(prev => ({
      ...prev,
      user_cards: [],
      computer_cards: [],
      result: '',
      is_game_over: false,
      user_score: 0,
      computer_score: 0
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bet: bet })
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error);
        setShuffling(false);
        return;
      }

      // Delay for visual effect of dealing cards
      setTimeout(() => {
        setGameData({
          ...data,
          computer_cards: [],
          computer_score: 0,
          result: ''
        });
        setIsGameStarted(true);
        setShuffling(false);
      }, 1000); // 1 second delay
    } catch (error) {
      console.error("Backend connection error:", error);
      alert("Could not connect to the game server. Please ensure the backend is running on http://127.0.0.1:5000");
      setShuffling(false);
    }
  };

  const hit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hit`, { method: 'POST' });
      const data = await response.json();
      setGameData(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Hit error:", error);
      alert("Server connection lost.");
    }
  };

  const stand = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stand`, { method: 'POST' });
      const data = await response.json();
      setGameData(data);
    } catch (error) {
      console.error("Stand error:", error);
      alert("Server connection lost.");
    }
  };


  return (
    <div className="game-wrapper">
      <div className="game-container">
        <header>
          <h1 className="title">BLACKJACK</h1>
          <div className="divider"></div>
          <div className="balance-display">
            Wallet: <span className="gold">${gameData.balance}</span>
          </div>
        </header>

        {!isGameStarted ? (
          <div className="lobby">
            <div className="betting-section">
              <h3 className="bet-label">Select Your Bet</h3>
              <div className="chip-container">
                {[10, 50, 100, 500].map(amt => (
                  <button
                    key={amt}
                    className={`chip chip-${amt} ${bet === amt ? 'selected' : ''} ${gameData.balance < amt ? 'disabled' : ''}`}
                    onClick={() => setBet(amt)}
                    disabled={gameData.balance < amt}
                  >
                    <span className="chip-value">${amt}</span>
                  </button>
                ))}
              </div>
            </div>
            <button className="btn action-btn deal-btn bounce" onClick={startGame} disabled={gameData.balance < bet || shuffling}>
              {shuffling ? "Shuffling..." : "DEAL CARDS"}
            </button>
          </div>
        ) : (
          <div className="table-area">
            <div className="hand-section dealer-section">
              <h2 className="label">Dealer {gameData.is_game_over && <span className="score-badge">{gameData.computer_score === 0 ? "BLACKJACK" : gameData.computer_score}</span>}</h2>
              <div className="cards-stack">
                {gameData.is_game_over
                  ? gameData.computer_cards.map((card, i) => <Card key={i} value={card} />)
                  : <><Card value={gameData.computer_first_card} /> <Card value={0} isFaceDown={true} /></>
                }
              </div>
            </div>

            <div className="hand-section player-section">
              <div className="cards-stack">
                {gameData.user_cards.map((card, i) => (
                  <Card key={i} value={card} />
                ))}
              </div>
              <h2 className="label">Your Hand <span className="score-badge">{gameData.user_score === 0 ? "BLACKJACK" : gameData.user_score}</span></h2>
            </div>

            {gameData.is_game_over && (
              <div className="result-overlay">
                <div className="result-content">
                  <h2 className="result-text">{gameData.result}</h2>
                  <button className="btn action-btn primary" onClick={startGame}>Play Again</button>
                </div>
              </div>
            )}

            <div className="controls-footer">
              {!gameData.is_game_over && (
                <div className="btn-group">
                  <button className="btn action-btn hit" onClick={hit}>Hit</button>
                  <button className="btn action-btn stand" onClick={stand}>Stand</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;