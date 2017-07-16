import Data from "../data";
import { MergeClassName, AssignSelect, FilterProps } from "./proto";
import React from "react";

let SVG = {};
Data.then('icons', e => { SVG = e.detail.value });

/*
 * @property iconName
 * @property viewBox
 * @property width
 * @property height
 */

function SvgIcon(props)
{
	let iconProps = FilterProps(props),
		name = props.iconName || "empty",
		className = 'svg-icon icon-' + name,
		svgProps = AssignSelect({viewBox: "0 0 24 24"}, props, ['width', 'height']),
		path,
		data = SVG[name] || "";

	if( typeof data === "string" ) {
		path = data
	}
	else if( data ) {
		if( data.viewBox ) svgProps.viewBox = data.viewBox;
		path = data.path || ""
	}

	MergeClassName(iconProps, className);

	return (
		<i {...iconProps}>
			<svg {...svgProps}>
				{path.length && path[0] == '#' ? <use xlinkHref={path} /> : <path d={path} />}
			</svg>
		</i>
	);
}

export default SvgIcon;