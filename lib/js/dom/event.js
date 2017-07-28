import Collection from "./collection";

const reg = /\s+/g;

function getName( name )
{
	return Array.isArray(name) ? name : String(name).split(reg)
}

function makeEvent(element, name, callback, fn)
{
	element = Collection(element);
	if( element ) {
		name = getName(name);
		for(let i = 0, j, node, ln = name.length, length = element.length; i < length; i++) {
			node = element[i];
			if( node[fn] ) {
				for(j = 0; j < ln; j++) {
					node[fn](name[j], callback, false)
				}
			}
		}
	}
}

export function Add(element, name, callback)
{
	makeEvent(element, name, callback, 'addEventListener')
}

export function Remove(element, name, callback)
{
	makeEvent(element, name, callback, 'removeEventListener')
}
