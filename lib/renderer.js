export class WebGLRenderer 
{
	constructor() 
	{
		this.domElement = document.querySelector("#glcanvas");
		this.gl = this.domElement.getContext("webgl")

		if (!this.gl) throw new Error("WebGL is not supported");

		this.clear(0.9, 0.9, 0.9, 1.0);
	}


	setSize(width, height) 
	{
		this.domElement.width = width;
		this.domElement.height = height;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	}

	clear(r, g, b, a) 
	{
		this.gl.clearColor(r, g, b, a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	setAnimationLoop(animation) 
	{
		function renderLoop() {
			animation();
			window.requestAnimationFrame(renderLoop);
		}

		renderLoop();
	}

	// render function executes all the time
	// can be thought of as the main game loop
	// @param {scene} - Scene to render
	// @param {shader} - Shader to use
	// for each primitive in the scene, updates the transform matrix and renders the primitve
	render(scene, shader) 
	{
		let resolution=[this.domElement.width, this.domElement.height]
		scene.primitives.forEach(function (primitive) {
			primitive.transform.updateModelTransformMatrix();

			shader.bindArrayBuffer(
				shader.vertexAttributesBuffer,
				primitive.vertexList
			);

			shader.fillAttributeData(
				"aPosition",
				primitive.vertexList,
				3,
				3 * primitive.vertexList.BYTES_PER_ELEMENT,
				0
			);
			shader.setUniform2f("uResolution", resolution)
			shader.setUniform4f("uColor", primitive.color);
			shader.setUniformMatrix4fv("uModelMatrix", primitive.transform.modelTransformMatrix);

			// Draw
			shader.drawArrays(primitive.vertexList.length / 3);
		});
	}


	glContext() 
	{
		return this.gl;
	}

	getCanvas() 
	{
		return this.domElement;
	}
}
