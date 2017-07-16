let Callbacks = {};

/**
 * @return {boolean}
 */
function Has(name)
{
	return Callbacks.hasOwnProperty(name)
}

export default {

	add(name, callback)
	{
		if( ! Has(name) && typeof callback == 'function' ) {
			Callbacks[name] = callback
		}
	},

	remove(name)
	{
		if( Has(name) ) {
			delete Callbacks[name]
		}
	},

	callable(name)
	{
		return Has(Array.isArray(name) ? name[0] : name)
	},

	dispatch(value, event = null)
	{
		let name, props = [];

		if( Array.isArray(value) ) {
			props = Object.assign([], value);
			name = props.shift()
		}
		else {
			name = String(value)
		}

		if( event ) {
			if( !Array.isArray(event) ) {
				event = [event]
			}
			if( props.length ) {
				props = event.apply(event, props)
			}
			else {
				props = event;
			}
		}

		return Has(name) ? Callbacks[name].apply(window, props) : null
	}
}