import React from "react";
import { Intents, Dimensions, FilterProps, MergeClassName, Proto } from "./proto";

const Path = "M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89";

/*
 * @property intent
 * @property dimension
 * @property value
 * @property spinner
 *
 **/

class ProgressCircle extends Proto
{
	render()
	{
		let self = this,
			state = self.state,
			props = FilterProps(state),
			pathProps = { pathLength: null, style: null },
			className = "pg-round",
			dimension = state.dimension || '',
			intent = state.intent || 'default';

		if( Dimensions.indexOf(dimension) > -1 ) {
			className += " pg-" + dimension
		}

		className += ' pg-' + ( Intents.indexOf(intent) < 0 ? Intents[0] : intent );

		if( typeof state.value == "number" ) {

			let proc = Math.floor(280 * (state.value || 0));
			if( isNaN(proc) || proc > 280 ) {
				proc = 280
			}
			else if( proc < 0 ) {
				proc = 0
			}

			pathProps.pathLength = "280";
			pathProps.style = {
				strokeDasharray: "280, 280",
				strokeDashoffset: 280 - proc
			};

			if( state.spinner ) {
				className += " pg-spinner"
			}
		}
		else {
			className += " pg-spinner"
		}

		MergeClassName(props, className);

		return (
			<div {...props}>
				<div className="pg-round-wrap">
					<svg viewBox="0 0 100 100">
						<path className="pg-round-track" d={Path} />
						<path className="pg-round-head"  d={Path} {...pathProps} />
					</svg>
				</div>
			</div>
		)
	}
}

export default ProgressCircle;