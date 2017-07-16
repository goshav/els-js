const reg = /\s+/g;

function getName( name )
{
	return Array.isArray(name) ? name : String(name).split(reg)
}

export function Add(element, name, callback)
{
	if( element && element.addEventListener ) {
		getName(name).forEach(eventName => {
			element.addEventListener(eventName, callback, false)
		})
	}
}

export function Remove(element, name, callback)
{
	if( element && element.removeEventListener ) {
		getName(name).forEach(eventName => {
			element.removeEventListener(eventName, callback, false)
		})
	}
}
