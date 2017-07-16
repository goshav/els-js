
import React from "react";
import { HtmlBlockNames, MergeClassName, FilterProps, Proto } from "./proto";
import { Create } from "../component";
import IsScalar from "../tools/is-scalar";

function GetComponent( state, index, form )
{
	let component = "Components", props = {};

	// component
	if( IsScalar(state) ) {
		component = String(state);
	}
	else {
		if( state.component ) {
			component = state.component
		}
		props = Object.assign({}, state);
		delete props.component; // fix recursive
	}

	props.key = index;
	if( form ) {
		props.emitter = form
	}

	return Create( component, props )
}

/*
 * @property tagName
 * @property child
 * @property emitter
 * @property component *
 */

class Components extends Proto
{
	render()
	{
		let self  = this,
			state = self.state,
			props = FilterProps( state ),
			name  = state.tagName || 'div',
			child = null;

		if( !HtmlBlockNames[name] ) {
			name = 'div'
		}

		// uiChild
		if( state.child && Array.isArray(state.child) ) {
			child = state.child.map( (component, index) => GetComponent(component, index, state.emitter) )
		}
		else if( state.component ) {
			child = GetComponent(state, 0, state.emitter)
		}
		else if( self.props.children ) {
			child = self.props.children
		}

		MergeClassName(props, "document-component");

		return React.createElement(name, props, child)
	}
}

export default Components;