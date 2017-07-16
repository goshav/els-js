/**
 * @return {boolean}
 */
export default function IsNumber(value)
{
	let tof = typeof value;

	if( tof != 'number' ) {
		if( tof == 'string' ) {
			value /= 1;
		}
		else {
			return false
		}
	}

	return ! isNaN(value) && isFinite(value)
}