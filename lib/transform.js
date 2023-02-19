import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export class Transform
{
	constructor()
	{
		this.transVec = vec3.create();
		vec3.set(this.transVec, 0, 0, 0);
		
		this.scale = vec3.create();
		vec3.set(this.scale, 1, 1, 1);
		
		this.rotAngle = 0;
		this.rotPnt = [0, 0, 0]
		this.rotAxis = vec3.create();
		vec3.set(this.rotAxis, 0, 0, 1);

		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);

		this.updateModelTransformMatrix();
	}

	updateModelTransformMatrix()
	{
		// @ToDO
		// 1. Reset the transformation matrix
		// 2. Use the current transformations values to calculate the latest transformation matrix
		mat4.identity(this.modelTransformMatrix);

		// transformation
		this.tranMat = mat4.create()
		mat4.translate(this.tranMat, this.modelTransformMatrix, this.transVec)

		// rotation
		this.rotMat = mat4.create()
		var temp = vec3.create()
		vec3.set(temp, this.rotPnt[0], this.rotPnt[1], this.rotPnt[2])
		mat4.translate(this.rotMat, this.modelTransformMatrix, temp)
		mat4.rotate(this.rotMat, this.rotMat, this.rotAngle, this.rotAxis)
		vec3.set(temp, -this.rotPnt[0], -this.rotPnt[1], -this.rotPnt[2])
		mat4.translate(this.rotMat, this.rotMat, temp)

		// scaling
		this.scalMat = mat4.create()
		var temp = vec3.create()
		vec3.set(temp, this.rotPnt[0], this.rotPnt[1], this.rotPnt[2])
		mat4.translate(this.scalMat, this.modelTransformMatrix, temp)
		mat4.scale(this.scalMat, this.scalMat, this.scale)
		vec3.set(temp, -this.rotPnt[0], -this.rotPnt[1], -this.rotPnt[2])
		mat4.translate(this.scalMat, this.scalMat, temp)

		// transformation
		mat4.multiply(this.modelTransformMatrix, this.tranMat, this.scalMat);
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, this.rotMat);
	}	

	translate(x, y, z) {
		vec3.set(this.transVec, this.transVec[0] + x, this.transVec[1] + y, this.transVec[2] + z);
	}

	translateTo(x, y, z) {
		vec3.set(this.transVec, x, y, z)
	}

	setPosition(x, y, z) {
		vec3.set(this.transVec, x, y, z);
	}

	rotAboutSetAxis(angle) {
		this.rotAngle += angle;
	}

	setAngleAboutSetAxis(angle) {
		this.rotAngle = angle;
	}

	setRotAxis(x, y, z) {
		vec3.set(this.rotAxis, x, y, z);
	}
	
	setRotPoint(x, y, z) {
		this.rotPnt = [x, y, z];
	}

	setScale(x, y, z) {
		vec3.set(this.scale, x, y, z);
	}
}