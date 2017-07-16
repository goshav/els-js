
// Polyphemus

typeof window !== "undefined" && (function(proto) {
	if( !proto.closest ) {
		proto.closest = function(selector) {
			var node = this;

			while (node) {
				if (node.matches(selector)) return node;
				else node = node.parentElement;
			}
			return null;
		};
		if( !proto.matches ) {
			proto.matches = proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
		}
	}
})(Element.prototype);

export default function(e, selector)
{
	return e && e.closest ? e.closest(selector) : null
}