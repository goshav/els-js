
import React from "react";
import SvgIcon from "./svg-icon";
import { FilterProps, Proto } from "./proto";

/*
 * @property iconName
 * @property textLabel
 *
 **/

class Link extends Proto
{
	render()
	{
		var self  = this,
			state = self.state,
			props = FilterProps( state, {className: "link"} ),
			child = [];

		if( !props.href ) {
			props.href = "#"
		}

		if( state.iconName ) {
			child.push(
				<SvgIcon iconName={state.iconName} key="icon" />
			)
		}

		if( state.textLabel ) {
			child.push(
				state.iconName ? <span key="label">{state.textLabel}</span> : state.textLabel
			)
		}

		if( !child.length && self.props.children ) {
			child = self.props.children
		}

		return (
			<a {...props}>{child}</a>
		)
	}
}

export default Link;