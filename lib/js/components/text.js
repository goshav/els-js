import React from "react";
import { HtmlBlockNames, Proto, FilterProps } from "./proto";
import IsScalar from "../tools/is-scalar";

/*
 * @property tagName
 * @property child
 * @property isHtml
 * @property text
 */

function CreateText( item, index )
{
	if( item === null || item === undefined ) {
		return null
	}

	if( IsScalar(item) ) {
		return String(item)
	}

	let name = 'div', props = {key: index}, text;

	FilterProps(item, props);

	if(item.child && Array.isArray(item.child)) {
		text = item.child.map( (e, i) => CreateText(e, i) )
	}
	else {
		text = String( item.text || '' );

		if( item.isHtml ) {
			props.dangerouslySetInnerHTML = { __html: text };
			text = null
		}

		if( typeof item.tagName === 'string' && HtmlBlockNames[item.tagName] ) {
			name = item.tagName
		}
	}

	return React.createElement( name, props, text )
}

class Text extends Proto
{
	render()
	{
		let self  = this,
			state = self.state,
			props = FilterProps(state),
			name  = state.tagName || 'div',
			child = null;

		if( ! HtmlBlockNames[name] ) {
			name = 'div'
		}

		if( state.child ) {

			if( Array.isArray(state.child) ) {
				child = state.child.map( (item, index) => CreateText(item, index) )
			}
			else {
				child = CreateText(state.child, 0)
			}
		}
		else if( state.text ) {

			if( state.isHtml ) {
				props.dangerouslySetInnerHTML = { __html: String(state.text) };
			}
			else {
				child = String(state.text)
			}
		}
		else if( self.props.children ) {
			child = self.props.children;
		}

		return React.createElement( name, props, child )
	}
}

export default Text;