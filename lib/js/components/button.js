import React from "react";
import { Intents, Dimensions, MergeClassName, FilterProps, Blur, Proto } from "./proto";
import SvgIcon from "./svg-icon";

/*
 * @property intent
 * @property dimension
 * @property fab
 * @property iconName
 * @property textLabel
 */

class Button extends Proto
{
	constructor(props)
	{
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick( original, e )
	{
		original.call(this, e) !== false && Blur({closest: ".btn"})
	}

	render()
	{
		let self  = this,
			state = self.state,
			props = FilterProps(state),
			className = 'btn btn-' + ( ~ Intents.indexOf(state.intent || '') || state.intent === 'link' ? state.intent : Intents[0] ),
			child = [];

		if( props.disabled ) {
			className += ' btn-disabled'
		}

		if( state.dimension && ~Dimensions.indexOf(state.dimension) ) {
			className += ' btn-' + state.dimension
		}

		if( state.fab ) {
			className += ' btn-fab';
		}

		if( state.iconName ) {
			if( !state.textLabel ) {
				className += ' btn-icon';
			}
			child.push(
				<SvgIcon iconName={state.iconName} key="icon" />
			)
		}

		if( state.textLabel ) {
			child.push(
				<span className="label" key="label">{state.textLabel}</span>
			)
		}

		if( !props.role ) {
			props.role = 'button'
		}

		props.ref  = 'button';
		MergeClassName(props, className);

		if( props.onClick ) {
			props.onClick = self.onClick.bind(self, props.onClick);
		}

		if( props.href ) {
			return <a {...props}>{child}</a>
		}
		else {
			return <button {...props}>{child}</button>
		}
	}
}

export default Button;