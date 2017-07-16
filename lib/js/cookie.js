
const re = /([\.$?*|{}\(\)\[\]\\\/\+^])/g;
const pr = ['path', 'domain', 'expires', 'secure', 'max-age'];

const Cookie = {

	set(name, value, options)
	{
		options = options || {};
		if (!options.path) options.path = '/';

		let expires = options.expires || 3600 * 24 * 31;

		if (typeof expires == "number" && expires) {
			var d = new Date();
			d.setTime(d.getTime() + expires * 1000);
			expires = options.expires = d;
		}

		if (expires && expires.toUTCString) {
			options.expires = expires.toUTCString();
		}

		name += "=" + encodeURIComponent(value);

		pr.forEach(val => {
			value = options[val] || false;
			if (value || value === 0) {
				name += "; " + val;
				if (value !== true) {
					name += "=" + value;
				}
			}
		});

		document.cookie = name;
	},

	get(name, defaultValue)
	{
		let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(re, '\\$1') + "=([^;]*)"));
		return matches ? decodeURIComponent(matches[1]) : defaultValue;
	}
};

export default Cookie;