
import Element from "../dom/element";

let init = false, width = 0;

/**
 * @return {number}
 */
export default function MeasureScrollbar()
{
	if( !init )
	{
		let body = document.body;
		if( body ) {
			init = true;
			let div1 = Element.create({ style: {width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -500, left: 0}, parent: body }),
				div2 = Element.create({ style: {height: 200, position: 'relative'}, parent: div1 });

			width = 100 - div2.offsetWidth;
			body.removeChild(div1);
		}
	}

	return width
};
