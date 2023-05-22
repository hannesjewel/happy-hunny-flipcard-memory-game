import replay from '../assets/img/icon-replay.svg'

const Button = ({className, onClick, text}) => {
    return(
        <button className={`_button ${className || ''}`} onClick={onClick}>
            <img src={replay} alt="" />
            {text || 'Replay'}
        </button>
    )
}

export default Button