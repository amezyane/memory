import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './Card'
import GuessCount from './GuessCount'

import HallOfFame, { FAKE_HOF } from './HallOfFame'

const SIDE = 6
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'
const VISUAL_PAUSE_MSECS = 750

class App extends Component {
  state = {
    cards: this.generateCards(),
    currentPair: [], // tableau représentant la paire en cours de sélection par la joueuse. À vide, aucune sélection en cours. Un élément signifie qu’une première carte a été retournée. Deux éléments signifient qu’on a retourné une seconde carte, ce qui déclenchera une analyse de la paire et l’avancée éventuelle de la partie.
    guesses: 0, // nombre de tentatives de la partie en cours (nombre de paires tentées, pas nombre de clics)
    matchedCardIndices: [], //  liste les positions des cartes appartenant aux paires déjà réussies, et donc visibles de façon permanente.
  }

  generateCards() {
    const result = []
    const size = SIDE * SIDE
    const candidates = shuffle(SYMBOLS)
    while (result.length < size) {
      const card = candidates.pop()
      result.push(card, card)
    }
    return shuffle(result)
  }

  // Arrow fx for binding
  handleCardClick = index => {
    const { currentPair } = this.state
    
    // Deux cartes ont déjà été sélectionnées
    if (currentPair.length === 2) {
      // On n'appelle pas la fonction "handleNewPairClosedBy"
      return
    } 
    
    // Aucune carte n'a déjà été sélectionnée
    if (currentPair.length === 0) {
      // On met à jour la variable "currentPair" avec la 1ère carte sélectionnée
      this.setState({ currentPair: [index] })
      // On n'appelle pas la fonction "handleNewPairClosedBy"
      return
    }
    
    // Une 2ème carte est sélectionnée
    this.handleNewPairClosedBy(index)
  }

  getFeedbackForCard(index) {
    // On récupère la paire courante, et la liste des cartes retournées
    const { currentPair, matchedCardIndices } = this.state // destructuring 
    // Boolean : la carte fait partie des cartes retournées
    const indexMatched = matchedCardIndices.includes(index)
  
    // Si elle est la seule carte sélectionnée 
    if (currentPair.length === 1) {
      // si elle a déjà été retournée ou bien son index correspond à la seule carte sélectionnée
      return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
    }
    
    // Sinon si deux cartes ont été sélectionnées, on regarde si elles ont font parti d'une paire gagnante ou non
    if (currentPair.includes(index)) {
      return indexMatched ? 'justMatched' : 'justMismatched'
    }
    
    // Sinon si la carte a été "trouvée", on les affiche par défaut
    return indexMatched ? 'visible' : 'hidden'
  }

  handleNewPairClosedBy(index) {
    const { cards, currentPair, guesses, matchedCardIndices } = this.state // destructuring 

    const newPair = [currentPair[0], index]
    const newGuesses = guesses + 1
    const matched = cards[newPair[0]] === cards[newPair[1]]
    this.setState({ currentPair: newPair, guesses: newGuesses })
    if (matched) {
      this.setState({ matchedCardIndices: [...matchedCardIndices, ...newPair] })  // "spreading" avec rest operator - équivalent à matchedCardIndices.concat(newPair)
    }
    setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS)
  }

  render() {
    const { cards, guesses, matchedCardIndices } = this.state
    const won = matchedCardIndices.length === cards.length
    return (
      <div className="memory">
        <GuessCount guesses={guesses} />
        {cards.map((card, index) => (
          <Card
            card={card}
            feedback={this.getFeedbackForCard(index)}
            index={index}
            key={index}
            onClick={this.handleCardClick}
          />
        ))}
        {won && <HallOfFame entries={FAKE_HOF} />}
      </div>
    )
  }
} 

export default App
