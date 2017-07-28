import IsNode from "./is-node";
import IsBrowser from "../tools/is-browser";

const isBrowser = IsBrowser();
const ToString = Object.prototype.toString;

/**
 * @return {boolean}
 */
function IsWindow(element)
{
	if( window === element ) {
		return true
	}

	let type = ToString.call(element);
	if( type === "[object Window]" || type === "[object DOMWindow]" ) {
		return true
	}

	if ('self' in element) {

		//`'self' in element` is true if
		//the property exists on the object _or_ the prototype
		//`element.hasOwnProperty('self')` is true only if
		//the property exists on the object
		let self, hasSelf = element.hasOwnProperty('self');

		try {
			if(hasSelf) {
				self = element.self;
			}
			delete element.self;
			if (hasSelf) {
				element.self = self;
			}
		}
		catch (e) {
			//IE 7&8 throw an error when window.self is deleted
			return true;
		}
	}

	return false
}

export default function Collection(element, isWindow = true)
{
	if( isBrowser && element ) {

		if( IsNode(element) ) {
			return [element]
		}

		let type = typeof element;
		if( type === "string" ) {
			return document.querySelectorAll(element)
		}

		if( isWindow && type === "object" && IsWindow(element) ) {
			return [element]
		}

		if( Array.isArray(element) ) {
			return element
		}

		type = ToString.call(element);
		if( type === '[object HTMLCollection]' || type === '[object NodeList]' ) {
			return element
		}
	}

	return null
}
