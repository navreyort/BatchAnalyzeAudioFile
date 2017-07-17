/*jshint esversion: 6 */

export class MathUtils {
	static featureScaleNormalize(v){
			var min = MathUtils.minimum(v);
			var max = MathUtils.maximum(v);

			for(var i=0, len=v.length;i<len;i++){
				v[i] = (v[i]-min)/(max-min);
			}
	}

	static mean(v) {
		return MathUtils.sum(v) / v.length;
	}

	static maximum(v) {
		var max = 0;
		for (var i = 0; i < v.length; i++) {
			if (max < v[i]) {
				max = v[i];
			}
		}
		return max;
	}

	static minimum(v) {
		var min = 100000000000000;
		for (var i = 0; i < v.length; i++) {
			if (min > v[i]) {
				min = v[i];
			}
		}
		return min;
	}

	static sum(v) {
		// v.reduce(function(a, b) { return a + b; });
		var sum = 0;
		for (var i = 0,len=v.length; i < len; i++) {
			sum += v[i];
		}
		return sum;
	}
}

export default MathUtils;
