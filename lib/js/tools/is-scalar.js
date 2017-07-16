
/**
 * @return {boolean}
 */
export default function IsScalar(value)
{
	if( value === null || value === undefined) {
		return true
	}
	let type = typeof value;
	return type == 'string' || type == 'number' || type == 'boolean';
}
