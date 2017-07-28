
import React from "react";
import SvgIcon from '../svg-icon';
import Button from '../button';
import ProgressLine from '../progress-line';
import { Proto } from "../proto";

/*
 * @property iconName
 * @property value
 * @property message
 * @property button
 * @property closable
 * @property onClose
 */

class ToastElement extends Proto
{
	progress(value)
	{
		let ref = this.refs.progress;
		if( ref ) {
			ref.setState({ value: value })
		}
	}

	render()
	{
		let self = this,
			state = self.state,
			className = "toast level-" + state.level,
			icon = state.iconName || ( state.level === 'error' ? 'bell' : '' ),
			wrap = [];

		if( icon ) {
			className += ' iconable';
			wrap.push(
				<SvgIcon iconName={icon} key="icon" />
			);
		}

		if( typeof state.progress == "number" ) {
			wrap.push(
				<div className="progress" key="progress">
					<ProgressLine value={state.progress} ref="progress" />
				</div>
			);
		}
		else {
			wrap.push(
				<div className="text" key="text">
					{state.message}
				</div>
			);
		}

		if( state.button ) {
			className += ' clickable';
			wrap.push( <Button {...state.button} key="button" /> );
			if( state.closable ) {
				wrap.push( <div className="divider" key="divider" /> )
			}
		}

		if( state.closable ) {
			className += ' closable';
			wrap.push( <Button iconName="close" onClick={state.onClose} key="close" /> )
		}

		return (
			<div className={className}>
				<div className="toast-box">
					{wrap}
				</div>
			</div>
		)
	}
}

export default ToastElement;