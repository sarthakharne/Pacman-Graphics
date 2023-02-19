import { Transform } from "./transform.js";

export class Pellet {
    constructor(
        center,
        type,
        size,
        color,
        vColor,
        mazeCoords
    ) {
        this.center = center
        this.type = type
        this.size = size
        this.color = color
        this.iColor = [0, 0, 0, 0]
        this.nColor = color
        this.vColor = vColor
        this.visited = false
        this.mazeCoords = mazeCoords
        this.config = 0

        this.nTrianlges = 12
        this.vertexList = []

        this.transform = new Transform()
        this.transform.rotPnt = center

        for(var i = 0;i < this.nTrianlges;i++) {
            this.vertexList.push(center[0], center[1], center[2])
            this.vertexList.push(center[0] + size * Math.cos(2*Math.PI*i/this.nTrianlges),
            center[1] + size * Math.sin(2*Math.PI*i/this.nTrianlges), center[2])
            this.vertexList.push(center[0] + size * Math.cos(2*Math.PI*(i+1)/this.nTrianlges),
            center[1] + size * Math.sin(2*Math.PI*(i+1)/this.nTrianlges), center[2])
        }

        this.vertexList = new Float32Array(this.vertexList)
    }

    visit() {
        this.visited = true
        this.color = this.vColor
    }
}