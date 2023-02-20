import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix'

export class Transform
{
	constructor()
	{
		// initialising different vectors and matrices
		// initiate the translation vector to zero
		this.transVec = vec3.create()
		vec3.set(this.transVec, 0, 0, 0)
		
		// initiate the scale vector to 1
		this.scale = vec3.create()
		vec3.set(this.scale, 1, 1, 1)
		
		// initiate the rotation angle as 0
		// initiate the rotation point as object center
		// initiate the rotation axis as z axis
		this.rotAngle = 0
		this.rotPnt = [0, 0, 0]
		this.rotAxis = vec3.create()
		vec3.set(this.rotAxis, 0, 0, 1)

		// initiate the model transform matrix as identity
		this.modelTransformMatrix = mat4.create()
		mat4.identity(this.modelTransformMatrix)

		this.updateModelTransformMatrix()
	}

	updateModelTransformMatrix()
	{
		// @ToDO
		// 1. Reset the transformation matrix
		// 2. Use the current transformations values to calculate the latest transformation matrix
		mat4.identity(this.modelTransformMatrix)

		// calculate the transformation matrix
		this.tranMat = this.applyTranslation(this.transVec)

		// calculate the scaling matrix
		this.scalMat = this.applyScale(this.rotPnt, this.scale)

		// calculate the rotation matrix
		this.rotMat = this.applyRotation(this.rotPnt, this.rotAngle, this.rotAxis)

		// apply transformation as translation -> scaling -> rotation
		mat4.multiply(this.modelTransformMatrix, this.tranMat, this.scalMat)
		mat4.multiply(this.modelTransformMatrix, this.modelTransformMatrix, this.rotMat)
	}

	applyTranslation(transVec) {
		// tranMat translates the object according to the translation vector
		var tranMat = mat4.create()
		mat4.translate(tranMat, this.modelTransformMatrix, transVec)

		return tranMat
	}

	applyRotation(rotPnt, rotAngle, rotAxis) {
		// rotMat rotates the object according to the inputs
		var rotMat = mat4.create()
		var helper = vec3.create()

		// calculate the translation vector to translate the object to its center
		vec3.set(helper, rotPnt[0], rotPnt[1], rotPnt[2])
		// translate the object to its center
		mat4.translate(rotMat, this.modelTransformMatrix, helper)
		// rotate the object
		mat4.rotate(rotMat, rotMat, rotAngle, rotAxis)
		// calculate the translation vector to translate the object back
		vec3.set(helper, -rotPnt[0], -rotPnt[1], -rotPnt[2])
		// translate the object back
		mat4.translate(rotMat, rotMat, helper)

		return rotMat
	}

	applyScale(rotPnt, scale) {
		var scalMat = mat4.create()
		var helper = vec3.create()

		// calculate the translation vector to translate the object to its center
		vec3.set(helper, rotPnt[0], rotPnt[1], rotPnt[2])
		// translate the object to its center
		mat4.translate(scalMat, this.modelTransformMatrix, helper)
		// scale the object
		mat4.scale(scalMat, scalMat, scale)
		// calculate the translation vector to translate the object back
		vec3.set(helper, -rotPnt[0], -rotPnt[1], -rotPnt[2])
		// translate the object back
		mat4.translate(scalMat, scalMat, helper)

		return scalMat
	}

	// add on some translation
	translateBy(x, y, z) {
		vec3.set(this.transVec, this.transVec[0] + x, this.transVec[1] + y, this.transVec[2] + z)
	}

	// replace with a new translation
	translateTo(x, y, z) {
		vec3.set(this.transVec, x, y, z)
	}

	// add on a rotation angle
	addRot(angle) {
		this.rotAngle += angle
	}

	// set a rotation angle
	setAngle(angle) {
		this.rotAngle = angle
	}

	// set a new axis for rotation
	setRotAxis(x, y, z) {
		vec3.set(this.rotAxis, x, y, z)
	}
	
	// set a new rotation point
	setRotPoint(x, y, z) {
		this.rotPnt = [x, y, z]
	}

	// set scaling factor
	setScale(x, y, z) {
		vec3.set(this.scale, x, y, z)
	}

	// reset the modelTransformMatrix and all other vectors
	resetMatrix() {
		vec3.set(this.transVec, 0, 0, 0)
		vec3.set(this.scale, 1, 1, 1)
		this.rotAngle = 0
		this.rotPnt = [0, 0, 0]
		vec3.set(this.rotAxis, 0, 0, 1)
		mat4.identity(this.modelTransformMatrix)

		this.updateModelTransformMatrix()
	}
}