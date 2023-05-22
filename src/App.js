import React, {createRef} from 'react'
import "./assets/scss/app.scss";
import Card from './components/Card';
import Button from './components/Button'

//images
import back1 from './assets/img/card-1-turned.svg'
import back2 from './assets/img/card-2-turned.svg'
import back3 from './assets/img/card-3-turned.svg'
import back4 from './assets/img/card-4-turned.svg'
import back5 from './assets/img/card-10-turned.svg'
import front1 from './assets/img/card-1.svg'
import front2 from './assets/img/card-2.svg'
import front3 from './assets/img/card-3.svg'
import front4 from './assets/img/card-4.svg'
import front5 from './assets/img/card-5.svg'
import front6 from './assets/img/card-6.svg'
import front7 from './assets/img/card-7.svg'
import front8 from './assets/img/card-8.svg'
import front9 from './assets/img/card-9.svg'
import front10 from './assets/img/card-10.svg'
import complete1 from './assets/img/card-1-complete.svg'
import complete2 from './assets/img/card-2-complete.svg'
import complete3 from './assets/img/card-3-complete.svg'
import complete4 from './assets/img/card-4-complete.svg'
import complete5 from './assets/img/card-5-complete.svg'
import complete6 from './assets/img/card-6-complete.svg'
import complete7 from './assets/img/card-7-complete.svg'
import complete8 from './assets/img/card-8-complete.svg'
import complete9 from './assets/img/card-9-complete.svg'
import complete10 from './assets/img/card-10-complete.svg'
import topDottedLine from './assets/img/img-top-dotted-line-mobile.svg'
import topDottedLineWidescreen from './assets/img/img-top-dotted-line.svg'
import bee from './assets/img/img-bee.svg'

const initialTurnedCardsArray = [
  {
    back: back1,
    title: 'shirt'
  },
  {
    back: back2,
    title: 'shoes'
  },
  {
    back: back3,
    title: 'cap'
  },
  {
    back: back4,
    title: 'dungaree'
  },
  {
    back: back5,
    title: 'skirt'
  },
]

const initialCardsArray = [
  {
    front: front1,
    complete: complete1,
  },
  {
    front: front2,
    complete: complete2,
  },
  {
    front: front3,
    complete: complete3,
  },
  {
    front: front4,
    complete: complete4,
  },
  {
    front: front5,
    complete: complete5,
  },
  {
    front: front6,
    complete: complete6,
  },
  {
    front: front7,
    complete: complete7,
  },
  {
    front: front8,
    complete: complete8,
  },
  {
    front: front9,
    complete: complete9,
  },
  {
    front: front10,
    complete: complete10,
  }
]

const shuffle = arr => {
  for (let i = arr.length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temp;
  }
  return arr;
}

const initialState = {
  cards: shuffle(initialTurnedCardsArray.concat(initialTurnedCardsArray)),
  turnedCards: [],
  clearedCards: {},
  shouldDisableAllCards: false,
  moves: 0,
  succeed: false,
  failed: false,
  movesLeft: 15,
  accuracy: 0,
  wins: 0
}

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = JSON.parse(localStorage.getItem('state')) || initialState
    this.timeout = createRef(null)
  }

  store = obj => {
    this.setState(obj)
    setTimeout(() => {
      localStorage.setItem('state', JSON.stringify(this.state))
    }, 300);
  }

  restart = () => {
    this.store({
      cards: shuffle(initialTurnedCardsArray.concat(initialTurnedCardsArray)),
      turnedCards: [],
      clearedCards: {},
      shouldDisableAllCards: false,
      moves: 0,
      succeed: false,
      failed: false,
      movesLeft: 10,
      accuracy: 0
    })
  }

  disable = () => {
    this.store({shouldDisableAllCards: true})
  };

  enable = () => {
    this.store({shouldDisableAllCards: false})
  };

  evaluate = () => {
    const [first, second] = this.state.turnedCards
    const {cards} = this.state
    this.enable();
    if(cards[first].title === cards[second].title){
      
      this.store({
        clearedCards: { ...this.state.clearedCards, [cards[first].title]: true },
        turnedCards: [],
        accuracy: this.state.accuracy + 1
      })
      this.timeout.current = setTimeout(() => {
        this.checkCompletion()
      }, 500);
      
      return

    } else {
      this.timeout.current = setTimeout(() => {
        this.store({ turnedCards: [] })
        this.checkCompletion()
      }, 500);
      
    }
  }

  handleOnClick = index => {
    
    if(this.state.turnedCards.length === 1){

      this.store({
        turnedCards: [...this.state.turnedCards, index],
        moves: this.state.moves + 1,
        movesLeft: this.state.movesLeft - 1
      })

      let timeout = null;
      timeout = setTimeout(this.evaluate, 300);

      this.disable();
      
      return () => {
        clearTimeout(timeout);
      };

    } else {

      clearTimeout(this.timeout.current);
      this.store({
        turnedCards: [index]
      })
    }
  }

  checkIsFlipped = (index) => {
    return this.state.turnedCards.includes(index);
  };

  checkIsInactive = card => {
    return Boolean(this.state.clearedCards[card.title]);
  };

  checkCompletion = () => {

    if (Object.keys(this.state.clearedCards).length === initialTurnedCardsArray.length) {
      this.store({
        succeed: true,
        wins: this.state.wins + 1
      })
      
      return
    } else if(this.state.movesLeft <= 0){
      this.store({
        failed: true
      })
    }
  }

  renderCards = () => {
    return this.state.cards.map((card, index) => {
      const {front, complete} = initialCardsArray[index]
      return (
        <Card 
          key={index} 
          index={index}
          back={card.back}
          front={front}
          complete={complete}
          onClick={this.handleOnClick}
          isDisabled={this.state.shouldDisableAllCards}
          isInactive={this.checkIsInactive(card)}
          isFlipped={this.checkIsFlipped(index)} />
      )
    })
  }

  renderScorePanel = () => {

    const {failed, succeed, moves, movesLeft, accuracy, wins} = this.state

    if(failed){
      return (
        <div>
          <p>You ran out of moves</p>
        </div>
      )
    }

    if(succeed){
      return (
        <div>
          <p>Congratulations! You won</p>
        </div>
      )
    }

    return (
      <>
      <div>Allowed Moves: {movesLeft}<br /></div>
      <div>Accuracy: {accuracy} / {moves}<br /></div>
      <div>Wins: {wins}<br /></div>
      <Button onClick={this.restart} />
      </>
    )
  }

  renderMixMatch = () => {

    const {succeed, failed} = this.state

    if(succeed || failed){
      return (
        <p className='_text'>
          <Button onClick={this.restart} />
        </p>
      )
    }

    return <p className='_text'>Mix & match the tiles<br />to reveal a surprise!</p>
  }

  render(){

    return (
      <>
      <section className='_main-section'>
        <div className='_grid _mobile'>
          <div className='_column'>
            <h1 className='_heading-1'><strong>Buy & sell</strong> premium, pre-loved fashion for little ones!</h1>
            <div className='_bee'><img src={bee} alt="bee" /></div>
            <div className='_pictures'>
              <img src={topDottedLine} alt="dotted line" className='_dotted-line' />
              {this.renderMixMatch()}
            </div>
          </div>
        </div>
        <div className='_grid _grid-3-1 _cards-grid'>
          <div className='_column'>
            <div className='_cards'>
              {!this.state.failed && this.renderCards()}
              {this.state.failed && <h2 className='_failed'>Game Over</h2>}
            </div>
            <div className='_score-panel'>
              {this.renderScorePanel()}
            </div>
          </div>
          <div className='_column'>
            <h1 className='_heading-1 _widescreen'>The perfect place to <strong>buy & sell</strong> premium, pre-loved fashion  for little ones!</h1>
            <h2 className='_subheading'><strong>Delivering something sweet, real soon!</strong> Join the hive to stay in the loop.</h2>
          </div>
          <div className='_widescreen'>
            <img src={topDottedLineWidescreen} alt="Top Dotted Line" className='_wds_dotted-line' />
            <img src={bee} className="_wds-bee" alt="bee" />
            {this.renderMixMatch()}
          </div>
        </div>
      </section>
      </>
    )
  }
}

export default App;
