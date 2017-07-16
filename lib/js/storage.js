
const re = /^>>>@(b|d|n|s|o):/;

let support = false;
let Dump = {};

if( typeof window !== "undefined" ) {
	try {
		var storage = window.localStorage, x = '__storage_test__';
		storage.setItem(x, x);
		if( storage.getItem(x) === x && JSON.parse('{"a":true}').a === true ) {
			storage.removeItem(x);
			support = true;
		}
	}
	catch(e) {}
}

function parse(value)
{
	let m = typeof value === 'string' && value.match(re);
	if( m ) {
		let key = m[1], parse = value.substr(6);
		if( key === 'o' ) {
			try {
				return JSON.parse(parse)
			} catch (e) {
				return value
			}
		}
		return key === 'b' ? parse === 'true' : (key === 'd' ? parseFloat(parse) : (key === 'n' ? null : parse));
	}

	return value === undefined ? null : value;
}

export default {

	get support()
	{
		return support
	},

	set( name, value )
	{
		if( support ) {
			let type = typeof value;
			localStorage.setItem( name, '>>>@' + (
				type === 'string' ? 's:' + value :
					type === 'boolean' ? 'b:' + String(value) :
						(value === null ? 'n:null' :
							(type === 'number' ? 'd:' + String(value) : 'o:' + JSON.stringify(value)))))
		}
		else {
			Dump[name] = value
		}
		return this
	},

	get( name )
	{
		if( support ) {
			return parse(localStorage.getItem( name ));
		}
		else {
			return Dump[name] === undefined ? null : Dump[name]
		}
	},

	clear()
	{
		if( support ) {
			localStorage.clear()
		}
		else {
			Dump = {}
		}
		return this
	},

	remove( name )
	{
		if( support ) {
			localStorage.removeItem( name )
		}
		else {
			delete Dump[name]
		}
		return this
	},

	on( callBack )
	{
		if( support ) {
			window.addEventListener('storage', (e) => {
				callBack(e.key, parse(e.newValue), e)
			});
		}
	}
};