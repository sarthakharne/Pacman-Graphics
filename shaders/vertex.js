export const vertexShaderSrc = `      
	attribute vec3 aPosition;
    uniform mat4 uModelMatrix;
	uniform vec2 uResolution;
    
	void main () {             
		vec2 position = vec2(uModelMatrix * vec4(aPosition, 1));

		// converts positions from pixel space to 0.0 -> 1.0 space
		vec2 zeroToOne = position / uResolution;

		//converts 0.0 -> 1.0 space to 0.0 -> 2.0 then -1.0 -> 1.0
		vec2 zeroToTwo = zeroToOne * 2.0;
		vec2 clipSpace = zeroToTwo - 1.0;

		gl_Position =  vec4(clipSpace * vec2(1, -1), 0, 1);
	}                          
`;