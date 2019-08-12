import React from 'react'
import PropTypes from 'prop-types'
import './Card.css' 

const HIDDEN_SYMBOL = '❓'

const Card = ({ card, feedback, index, onClick }) => (
	<div className={`card ${feedback}`} onClick={() => onClick(index)}>
		<div className="symbol">
			{feedback === 'hidden' ? HIDDEN_SYMBOL : card}
		</div>
	</div>
)

Card.propTypes = {
	card: PropTypes.string.isRequired,
	feedback: PropTypes.oneOf([
		'hidden',
		'justMatched',
		'justMismatched',
		'visible'
	]).isRequired,
	index: PropTypes.number.isRequired,
	onClick: PropTypes.func.isRequired,
}

export default Card