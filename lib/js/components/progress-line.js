import React from "react";
import { Intents, FilterProps, MergeClassName, Proto } from "./proto";

/*
 * @property intent
 * @property stripes
 * @property animation
 * @property value
 *
 **/

class ProgressLine extends Proto
{
	render()
	{
		let self = this,
			state = self.state,
			props = FilterProps(state),
			className = "pg-line",
			intent = state.intent || 'default',
			proc = Math.floor(100 * (state.value || 0)), style;

		className += ' pg-' + (Intents.indexOf(intent) < 0 ? Intents[0] : intent);

		if( state.stripes !== false ) className += ' pg-stripes';
		if( state.animation !== false ) className += ' pg-animation';

		if( isNaN(proc) || proc > 100 ) {
			proc = 100
		}
		else if( proc < 0 ) {
			proc = 0
		}

		style = {width: proc + "%"};

		MergeClassName(props, className);

		return (
			<div {...props}>
				<div className="pg-meter" style={style} />
			</div>
		)
	}
}

export default ProgressLine;
