
import React from "react";

let Components = {};

function Add(name, component)
{
	if( typeof name === 'object' && arguments.length == 1 ) {
		Object.keys(name).forEach( cmp => {
			Add( cmp, name[cmp] )
		})
	}
	else {
		name = String(name);
		if( ! Components.hasOwnProperty( name ) ) {
			Object.defineProperty(Components, name, {
				value: component,
				configurable: false,
				writable: false
			})
		}
	}
}

function Component(name)
{
	return Components[name] || Components.Empty;
}

function Create(name, props = {}, child = null)
{
	return React.createElement( Component(name), props, child )
}

/**
 * @return {boolean}
 */
function GetIs(name)
{
	return Components.hasOwnProperty( name )
}

Add("Empty", function Empty(props) { return React.createElement('div', props) });

export {Add, Component, Create, GetIs}