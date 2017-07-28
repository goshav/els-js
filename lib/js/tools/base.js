import IsBrowser from "./is-browser";

// set default Polyphemus

if(!Array.isArray) {
	Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

// matches, closest

if(IsBrowser() && window.Element) {
	let proto = Element.prototype;

	if( !proto.matches ) {
		proto.matches =
			proto.matchesSelector ||
			proto.mozMatchesSelector ||
			proto.msMatchesSelector ||
			proto.oMatchesSelector ||
			proto.webkitMatchesSelector ||
			function(selector) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(selector), i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
	}

	if( !proto.closest ) {
		proto.closest =
			function(selector) {
				var node = this;
				while(node) {
					if (node.matches(selector)) return node;
					else node = node.parentElement;
				}
				return null;
			};
	}
}

export default {}