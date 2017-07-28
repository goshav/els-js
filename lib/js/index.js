import * as Dom from "./dom/index";
import AjaxJson from "./ajax-json";
import Caller from "./caller";
import * as Component from "./component";
import * as Components from "./components/index";
import Cookie from "./cookie";
import Data from "./data";
import History from "./history";
import HotKeys from "./hot-keys";
import Load from "./load";
import Storage from "./storage";
import Trigger from "./trigger";
import Tools from "./tools/index";

// services
import Toast from "./toast";

const Version = 1.01;

let ElsObject = {};

function ElsJs()
{
	return ElsObject;
}

function Extend(name, value = null)
{
	let type = typeof name;

	if( type === 'object' && name !== null ) {
		Object.keys(name).forEach(n => {
			Extend(n, name[n])
		})
	}
	else if( type == 'string' && ! ElsObject.hasOwnProperty(name) && ! ElsObject[name] ) {
		Object.defineProperty(ElsObject, name, {
			value: value,
			configurable: false,
			writable: false
		})
	}
}

Extend({ Extend, Version });

Component.Add( Components );

export {
	ElsJs, Extend, Version,
	AjaxJson, Caller, Component, Cookie, Data, History, HotKeys, Load, Storage, Trigger, Tools,
	Dom, Components,
	Toast
}