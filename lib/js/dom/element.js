import IsNode from "./is-node";
import { Add } from "./event";
import Collection from "./collection";

const regClassId = /(#|\.)([^#.]+)/g;
let cssNumber = {};

('animationIterationCount,columnCount,fillOpacity,flexGrow,flexShrink,fontWeight,lineHeight,opacity,order,orphans,widows,zIndex,zoom').split(',').forEach(n => { cssNumber[n] = true });

const Element = {

	byId( id )
	{
		return document.getElementById( id )
	},

	byQueryOne( query )
	{
		return document.querySelector( query )
	},

	byQuery( query )
	{
		return document.querySelectorAll( query )
	},

	byClassName( name )
	{
		return document.getElementsByClassName( name )
	},

	byTag( name )
	{
		return document.getElementsByTagName( name )
	},

	byName( name )
	{
		return document.getElementsByName( name )
	},

	create( props )
	{
		props = props || {};

		if( typeof props === "string" ) {
			props = {
				name: props
			}
		}

		let classes = [];
		let name = (props.name || 'div').replace(regClassId, (m, a, b) => { if( a == '#' ) props.id = b; else classes.push(b); return '' });
		let elm = props.nameSpace ? document.createElementNS(props.nameSpace, name) : document.createElement(name);
		let keys = [], value;
		let attributes = props.attrs || 0;
		let properties = props.props || 0;
		let events = props.events || 0;
		let data = props.data || 0;

		// class name
		if( props.className ) {
			classes.push(props.className);
		}
		if( classes.length ) {
			elm.className = classes.join(" ");
		}

		if( props.id ) {
			elm.setAttribute('id', props.id)
		}

		if( properties ) {
			keys = Object.keys(properties);
			keys.forEach(name => {
				elm[name] = properties[name]
			})
		}

		if( attributes ) {
			keys = Object.keys(attributes);
			keys.forEach(name => {
				elm.setAttribute( name, attributes[name] || '' )
			})
		}

		if( data ) {
			keys = Object.keys(data);
			keys.forEach(name => {
				value = data[name];
				if( value !== null && value !== undefined ) {
					if( typeof value == "object" ) {
						try { value = JSON.stringify(value) }
						catch(e) { value = '{}' }
					}
					elm.dataset[name] = value;
				}
			})
		}

		if( events ) {
			keys = Object.keys(events);
			keys.forEach((name) => {
				Add( elm, name, events[name] )
			})
		}

		if( props.style ) {
			this.css( elm, props.style )
		}

		if( props.parent !== undefined && props.parent.nodeType ) {
			let parent = props.parent;
			if( !props.prepend || !parent.firstChild ) {
				parent.appendChild(elm)
			}
			else {
				parent.insertBefore(elm, parent.firstChild)
			}
		}

		if( props.text ) {
			elm.appendChild(
				document.createTextNode(String(props.text))
			)
		}
		else if( props.html ) {
			try {
				elm.innerHTML = String(props.html)
			}
			catch(e) {}
		}
		else if( props.children && Array.isArray(props.children) ) {
			props.children.forEach(child => {
				if( !IsNode(child) ) {
					let tof = typeof child;
					if( tof === 'string' ) child = document.createTextNode(child);
					else if( tof === 'object' ) child = Element.create(child);
					else if( tof === 'function' ) {
						child = child();
						if( !IsNode(child) ) {
							return
						}
					}
					else return;
				}
				elm.appendChild(child)
			})
		}

		return elm
	},

	css(element, props)
	{
		element = Collection(element);
		if( element ) {
			let i, elem, styles = [];

			for( i = 0; i < element.length; i++ ) {
				if( (elem = element[i]) && elem.nodeType !== 3 && elem.nodeType !== 8 && elem.style ) {
					styles[styles.length] = elem.style
				}
			}

			if( styles.length ) {
				for( let n = 0, keys = Object.keys(props), name, value, keysLength = keys.length, stylesLength = styles.length; n < keysLength; n++ ) {
					name   = keys[n];
					value  = props[name];
					value += typeof value === "number" && !cssNumber[name] ? 'px' : '';

					for( i = 0; i < stylesLength; i++ ) {
						styles[i][name] = value
					}
				}
			}
		}
	}
};

export default Element;