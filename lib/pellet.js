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
        // handling the inputs
        this.center = center
        this.type = type
        this.size = size
        this.color = color
        this.nColor = color
        this.vColor = vColor
        this.mazeCoords = mazeCoords
        
        // initialising visited state
        this.visited = false

        this.nTrianlges = 12
        this.vertexList = []

        // transform object
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

    // change the color and mark visited
    visit() {
        this.visited = true
        this.color = this.vColor
    }

    // change the color and mark unvisited
    unvisit() {
        this.visited = false
        this.color = this.nColor
    }
}