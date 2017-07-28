// style-sheet.js
import IsBrowser from "../tools/is-browser";

let DOM_SHEET, index = 0, addCSSRule = (selector, rules) => {};

if( IsBrowser() ) {

	// add stylesheets
	DOM_SHEET = (style => {
		style.appendChild(document.createTextNode("")); // WebKit hack :(
		document.head.appendChild(style);
		return style.sheet;
	})( document.createElement("style") );

	if("insertRule" in DOM_SHEET) {
		addCSSRule = (selector, rules) => {
			DOM_SHEET.insertRule(selector + "{" + rules + "}", index ++)
		};
	}
	else if("addRule" in DOM_SHEET) {
		addCSSRule = (selector, rules) => {
			DOM_SHEET.addRule(selector, rules, index ++)
		};
	}
}

export default function (selector, rules = null)
{
	if(typeof selector === 'object') {
		Object.keys(selector).forEach(name => {
			addCSSRule(name, selector[name])
		})
	}
	else {
		addCSSRule(selector, rules)
	}
}