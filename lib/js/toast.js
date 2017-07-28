
import React from "react";
import ReactDOM from "react-dom";
import { Event, ClassName, Element, StyleSheets } from "./dom/index";
import ToastElement from './components/services/toast-element';
import IsBrowser from './tools/is-browser';

let _init = false;

let NODE_TERM = null, NODE_WRAP = null, autoID = 0;

let logs = {},
	timeout = {},
	react = {},
	stateData = {},
	opened = false;

let termTop = 10;
let termDir = "TR";
let prevDir = null;
let centerCalc = false;

function toastInit()
{
	if( !_init && IsBrowser() && document.body ) {

		// create elements

		NODE_TERM = Element.create({id: "toast-console", className: "toast-console", style: {display: "none"}, parent: document.body});
		NODE_WRAP = Element.create({className: "toast-wrap", parent: NODE_TERM});
		Toast.dir = termDir;

		// add stylesheets

		StyleSheets({
			".toast-console": 'position: fixed; left: 0; right: 0; height: 0',
			".toast-console .toast-wrap, .toast-console .toast": 'position: relative',
			".toast-console .toast": 'padding: 10px; background-color: rgba(0,0,0,.92); color: white',
			".toast-console.dir-top": 'top: 0',
			".toast-console.dir-bottom": 'bottom: 0',
			".toast-element": 'position: absolute',
			".toast-console.dir-left .toast-element": 'left: 0',
			".toast-console.dir-right .toast-element": 'right: 0',
		});

		try {
			let a = Element.create(), b = "calc(100% - 1px)";
			a.style.left = b;
			centerCalc = a.style.left === b
		}
		catch(e) {}

		if( !centerCalc ) {
			StyleSheets({
				".toast-console.dir-center .toast-element": 'left: 50%',
				".toast-console.dir-center .toast": 'left: -50%',
			})
		}

		_init = true;
	}

	return _init
}

function toastOpen(props)
{
	// open ...
	if( !toastInit() ) {
		throw Error("Document page is not ready")
	}

	let state = typeof props === 'string' ? {message: props} : Object.assign({}, props);
	if( !state.id ) {
		state.id = ('auto-' + (++autoID));
	}

	let id = state.id, calculate = ! logs[id];

	// create node element

	if( stateData[id] ) {
		state = Object.assign(stateData[id], state)
	}

	if( calculate ) {
		delete react[id];
		logs[id] = Element.create({ id: "toast-" + id, className: 'toast-element fade', parent: NODE_WRAP, prepend: true });
	}

	// remove old timeout

	if( timeout[id] ) {
		clearTimeout(timeout[id]);
		timeout[id] = 0;
		ClassName.add( logs[id], "in" )
	}

	state.level = (state.level || 'debug').toLowerCase();

	// create new timeout

	if( typeof state.progress == 'number' ) {
		state.timeout = false
	}

	if( state.timeout !== false ) {

		let time = typeof state.timeout === 'number' ? state.timeout : 10;

		if( time < 30 ) {
			time *= 1000;
		}
		else if( time < 1000 ) {
			time = 5000;
		}

		timeout[id] = setTimeout(() => toastClose(id), time);
	}

	if(state.hasOwnProperty('timeout')) {
		delete state.timeout
	}

	state.closable = state.closable !== false;
	state.onClose = () => {
		toastClose(id)
	};

	if( !react[id] ) {
		react[id] = ReactDOM.render( <ToastElement {...state} />, logs[id] )
	}
	else {
		react[id].setState(state)
	}

	if( !opened ) {
		opened = true;
		NODE_TERM.style.display = 'block';
		Event.Add(window, "resize orientationchange", calc)
	}

	stateData[id] = state;
	if( calculate ) {
		calc();
		setTimeout(() => { if( logs[id] && logs[id].parentNode ) { ClassName.add(logs[id], "in") } }, 10);
	}

	return id
}

function toastClose( id )
{
	if( logs[id] ) {

		if( timeout[id] ) {
			clearTimeout(timeout[id])
		}

		ClassName.remove(logs[id], "in");

		timeout[id] = setTimeout(() => {

			let element = logs[id];

			delete logs[id];
			delete timeout[id];
			delete stateData[id];

			if( element ) {
				NODE_WRAP.removeChild( element );

				if( !NODE_WRAP.firstChild ) {
					opened = false;
					NODE_TERM.style.display = 'none';
					Event.Remove(window, "resize orientationchange", calc)
				}
				else {
					calc()
				}
			}
		}, 300);
	}
}

function calc()
{
	let val = 0,
		top = termDir[0] == "T",
		key = top ? "top" : "bottom",
		cnt = centerCalc && termDir[1] == "C",
		changeVertical = (prevDir ? (prevDir[0] == "T" ? "top" : "bottom") : null) === key ? false : (top ? "bottom" : "top"),
		changeHorizontal = centerCalc && prevDir && !cnt && prevDir[1] == "C",
		element = NODE_WRAP.firstChild,
		fromValue, toValue;

	prevDir = termDir;

	while( element ) {

		val += termTop;
		fromValue = element.style[key];
		toValue = val + 'px';

		if( fromValue !== toValue ) {
			element.style[key] = toValue
		}

		if( changeVertical ) {
			element.style[changeVertical] = "";
		}

		if( changeHorizontal ) {
			element.style.left = ""
		}
		else if( cnt ) {
			element.style.left = "calc(50% - " + element.offsetWidth/2 + "px)"
		}

		val += element.offsetHeight;
		element = element.nextSibling;
	}
}

class ToastItem
{
	constructor(id)
	{
		Object.defineProperty(this, "id", {
			value: id,
			configurable: false,
			writable: false
		})
	}

	get isOpen()
	{
		return logs.hasOwnProperty(this.id)
	}

	close()
	{
		toastClose(this.id)
	}

	progress(value)
	{
		let id = this.id;
		if( react[id] ) {
			react[id].progress(value)
		}
	}

	update(props = {})
	{
		let id = this.id;
		if( this.isOpen ) {
			if( typeof props === 'string' ) {
				props = {message: props}
			}
			props.id = id;
			toastOpen(props)
		}
	}
}

const Toast = {

	get divider()
	{
		return termTop
	},

	set divider(value)
	{
		if( typeof value == "number" && value >= 0 && value <= 50 ) {
			termTop = value
		}
	},

	get dir()
	{
		return termDir
	},

	set dir(value)
	{
		if( IsBrowser() ) {
			let newVal = "", className = "toast-console";
			value = String(value).toUpperCase();

			// bottom
			if( ~ value.indexOf("B") ) {
				newVal += 'B';
				className += " dir-bottom"
			}
			else {
				newVal += 'T';
				className += " dir-top"
			}

			if( ~ value.indexOf("L") ) {
				newVal += 'L';
				className += " dir-left"
			}
			else if( ~ value.indexOf("C") ) {
				newVal += 'C';
				className += " dir-center"
			}
			else {
				newVal += 'R';
				className += " dir-right"
			}

			termDir = newVal;
			if( NODE_TERM ) NODE_TERM.className = className;
			_init && calc();
		}
	},

	close(id = null)
	{
		toastClose( id );
		return this
	},

	closeAll()
	{
		Object.keys(logs).forEach(id => toastClose(id));
		return this
	},

	update: calc,

	progress(id, value)
	{
		if( react[id] ) {
			react[id].progress(value)
		}
		return this
	},

	opened(id = null)
	{
		if( id ) {
			return logs.hasOwnProperty(id)
		}
		else {
			return NODE_WRAP.firstChild ? true : false
		}
	},

	open(props = {})
	{
		return new ToastItem( toastOpen(props) )
	}
};

export default Toast;