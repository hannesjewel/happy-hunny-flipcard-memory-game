import React from 'react'

class Card extends React.Component  {

    onClick = () => {
        const {onClick, index, isFlipped, isDisabled} = this.props
        !isFlipped && !isDisabled && onClick(index);
    }

    render(){
        const {front, back, complete, isFlipped, isInactive} = this.props
        return (
            <div className={
                `_card 
                ${isFlipped ? 'is-flipped' : ''} 
                ${isInactive ? 'is-inactive' : ''}`
                } onClick={this.onClick}>
                <div className='_card-inner'>
                    <img className='_card-front' src={front} alt="" />
                    <img className='_card-back' src={back} alt=""  />
                </div>
                <div className='_complete'>
                    <img src={complete} alt="" />
                </div>
            </div>
        )
    }
}

export default Card