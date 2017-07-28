import Ready from "./ready";

let Page = {};

if( typeof window !== "undefined" && window.document && window.navigator )
{
	let Body = {};
	const DocElem = document.documentElement;
	const GetBody = () => document.body;

	const ua = navigator.userAgent.toLowerCase();
	const isOpera = (ua.indexOf('opera')  > -1);
	const isIE = (!isOpera && ua.indexOf('msie') > -1);

	if( GetBody() ) {
		Body = GetBody()
	}
	else {
		Ready(() => {
			Body = GetBody()
		})
	}

	function getViewportWidth()
	{
		return ((document.compatMode || isIE) && !isOpera) ? (document.compatMode == 'CSS1Compat') ? DocElem.clientWidth : Body.clientWidth : (document.parentWindow || document.defaultView).innerWidth;
	}

	function getViewportHeight()
	{
		return ((document.compatMode || isIE) && !isOpera) ? (document.compatMode == 'CSS1Compat') ? DocElem.clientHeight : Body.clientHeight : (document.parentWindow || document.defaultView).innerHeight;
	}

	Page =
	{
		get width()
		{
			return window.innerWidth || Body.clientWidth
		},

		get height()
		{
			return window.innerHeight || Body.clientHeight
		},

		get top()
		{
			return (window.pageYOffset || DocElem.scrollTop || Body.scrollTop) - (DocElem.clientTop || Body.clientTop || 0)
		},

		get left()
		{
			return (window.pageXOffset || DocElem.scrollLeft || Body.scrollLeft) - (DocElem.clientLeft || Body.clientLeft || 0)
		},

		get viewportWidth()
		{
			return Math.max(document.compatMode != 'CSS1Compat' ? Body.scrollWidth : DocElem.scrollWidth, getViewportWidth())
		},

		get viewportHeight()
		{
			return Math.max(document.compatMode != 'CSS1Compat' ? Body.scrollHeight : DocElem.scrollHeight, getViewportHeight())
		},

		all()
		{
			let self = this;
			return {
				width: self.width,
				height: self.height,
				viewportWidth: self.viewportWidth,
				viewportHeight: self.viewportHeight,
				left: self.left,
				top: self.top
			}
		}
	};
}

export default Page;