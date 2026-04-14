import random

class BlackjackLogic:
    def __init__(self):
        self.cards = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]

    def deal_card(self):
        """Returns a random card from the deck."""
        return random.choice(self.cards)

    def calculate_score(self, cards):
        """Take a list of cards and return the score calculated from the cards."""
        if sum(cards) == 21 and len(cards) == 2:
            return 0  # Represents Blackjack

        if 11 in cards and sum(cards) > 21:
            cards.remove(11)
            cards.append(1)
        return sum(cards)

    def compare(self, user_score, computer_score):
        """Compares scores and returns the result string."""
        if user_score > 21 and computer_score > 21:
            return "You went over. You lose 😤"

        if user_score == computer_score:
            return "Draw 🙃"
        elif computer_score == 0:
            return "Lose, opponent has Blackjack 😱"
        elif user_score == 0:
            return "Win with a Blackjack 😎"
        elif user_score > 21:
            return "You went over. You lose 😭"
        elif computer_score > 21:
            return "Opponent went over. You win 😁"
        elif user_score > computer_score:
            return "You win 😃"
        else:
            return "You lose 😤"

    def dealer_play(self, dealer_cards):
        """Simulates dealer logic: hit until score is at least 17."""
        dealer_score = self.calculate_score(dealer_cards)
        while dealer_score != 0 and dealer_score < 17:
            dealer_cards.append(self.deal_card())
            dealer_score = self.calculate_score(dealer_cards)
        return dealer_cards, dealer_score