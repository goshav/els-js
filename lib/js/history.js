
const isSupport = !! (typeof window != "undefined" && "onpopstate" in window);

let fn = [];
let LocationPath = isSupport ? location.pathname + location.search : "";

function change(e)
{
	let url = e && e.state && e.state.path;
	if( url !== LocationPath ) {
		LocationPath = url;
		for( var i = 0; i < fn.length; i++ ) fn[i]({ path: url, native: true })
	}
}

if( isSupport )
{
	window.addEventListener('popstate', change, false)
}

export default
{
	get support()
	{
		return isSupport
	},

	get path()
	{
		return LocationPath
	},

	on( callback )
	{
		if( isSupport )
		{
			fn.push(callback);
		}
	},

	change( path, title )
	{
		if( isSupport ) {
			LocationPath = path;
			history.pushState({path: LocationPath}, title, path)
		}
	}
};