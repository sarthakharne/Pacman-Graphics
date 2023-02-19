import { Scene, Triangle, Quadrilateral, WebGLRenderer, Shader } from './lib/threeD.js';
import { vertexShaderSrc    } from './shaders/vertex.js';
import { fragmentShaderSrc } from './shaders/fragment.js';
import { Circle } from './lib/circle.js';
import { maze1 } from './lib/maze1.js';
import { maze2 } from './lib/maze2.js';
import { maze3 } from './lib/maze3.js';
import { Maze } from './lib/maze.js';


const renderer = new WebGLRenderer();
const width = window.innerWidth-25
const height = window.innerHeight-25
renderer.setSize(width, height);

document.body.appendChild(renderer.domElement);

const shader = new Shader(
    renderer.glContext(),
    vertexShaderSrc,
    fragmentShaderSrc
); 

shader.use();
const scene = new Scene();

const tileLength = 30
var m1 = new Maze(maze1, tileLength, 'maze1', [width, height, 0], true)
// for(var i = 0;i < m1.primitiveList.length;i++) {
//     scene.add(m1.primitiveList[i])
// }

var m2 = new Maze(maze2, tileLength, 'maze2', [width, height, 0], true)
// for(var i = 0;i < m2.primitiveList.length;i++) {
//     scene.add(m2.primitiveList[i])
// }

var m3 = new Maze(maze3, tileLength, 'maze3', [width, height, 0], true)
// for(var i = 0;i < m3.primitiveList.length;i++) {
//     scene.add(m3.primitiveList[i])
// }

var mazeList = [m1, m2, m3]
var currMaze = 0
for(var i = 0;i < mazeList[currMaze].primitiveList.length;i++) {
    scene.add(mazeList[currMaze].primitiveList[i])
}


var pacmanMazeCoords = [mazeList[currMaze].initPacmanMazeCoords[0],
mazeList[currMaze].initPacmanMazeCoords[1], mazeList[currMaze].initPacmanMazeCoords[2]]
const pacman = new Circle(
    10,
    [mazeList[currMaze].widthOffset + pacmanMazeCoords[1]*tileLength + tileLength/2,
    mazeList[currMaze].heightOffset + pacmanMazeCoords[0]*tileLength + tileLength/2, pacmanMazeCoords[2]],
    [1.0, 1.0, 0.0, 1]
)
const pacmanSpeed = tileLength

scene.add(pacman)
// scene.add(m1)

var moveMode = true

document.addEventListener("keydown", event => {
    // console.log(event);
    // moveMode = true
    var mvFlg = false
    var rotFlg = false
    pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])

    // for(var i = 0;i < mazeList[currMaze].enemList.length;i++) {
    //     mazeList[currMaze].enemList[i].transform.setRotPoint(mazeList[currMaze].enemList[i].center[0],
    //         mazeList[currMaze].enemList[i].center[1], mazeList[currMaze].enemList[i].center[2])
    //     mazeList[currMaze].enemList[i].calcAngleGivenConfiguration(pacman.config)
    //     mazeList[currMaze].enemList[i].transform.setAngleAboutSetAxis(mazeList[currMaze].enemList[i].locAngle)
    //     // mazeList[currMaze].enemList[i].transform.rotAboutSetAxis(90 * Math.PI / 180)
    // }

    // debug
    if(moveMode) {
        if(event.key == "(") {
            pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
            pacman.locRotAboutSetAxis(-45 * Math.PI / 180)
            pacman.transform.setAngleAboutSetAxis(pacman.locAngle)
            // pacman.transform.rotAboutSetAxis(-45 * Math.PI/180);
        }
        if(event.key == ")") {
            pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
            pacman.locRotAboutSetAxis(45 * Math.PI / 180)
            pacman.transform.setAngleAboutSetAxis(pacman.locAngle)
            // pacman.transform.rotAboutSetAxis(45 * Math.PI/180);
        }

        if(event.key == "ArrowUp") {
            if(pacman.config == 0) {
                mvFlg = moveOgUp(3)
            } else if(pacman.config == 1) {
                mvFlg = moveOgLeft(3)
            } else if(pacman.config == 2) {
                mvFlg = moveOgDown(3)
            } else if(pacman.config == 3) {
                mvFlg = moveOgRight(3)
            }
            // pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
            // pacman.locSetAngleAboutSetAxis(-90 * Math.PI / 180)
            // pacman.transform.setAngleAboutSetAxis(pacman.locAngle)
            // // pacman.transform.setAngleAboutSetAxis(-90 * Math.PI / 180)
            // if(mazeList[currMaze].layout[pacmanMazeCoords[0]-1][pacmanMazeCoords[1]] != 1) {
            //     // console.log(mazeList[currMaze].initPacmanMazeCoords)
            //     pacman.translate(0, -pacmanSpeed, 0)
            //     // pacman.transform.translate(0, -pacmanSpeed, 0)
            //     mvFlg = true
            //     pacmanMazeCoords[0] = pacmanMazeCoords[0] - 1
            // }
        }
        if(event.key == "ArrowRight") {
            if(pacman.config == 0) {
                mvFlg = moveOgRight(0)
            } else if(pacman.config == 1) {
                mvFlg = moveOgUp(0)
            } else if(pacman.config == 2) {
                mvFlg = moveOgLeft(0)
            } else if(pacman.config == 3) {
                mvFlg = moveOgDown(0)
            }
            // pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
            // pacman.locSetAngleAboutSetAxis(0 * Math.PI / 180)
            // pacman.transform.setAngleAboutSetAxis(pacman.locAngle)
            // // pacman.transform.setAngleAboutSetAxis(0 * Math.PI / 180)
            // if(mazeList[currMaze].layout[pacmanMazeCoords[0]][pacmanMazeCoords[1]+1] != 1) {
            //     // console.log(mazeList[currMaze].initPacmanMazeCoords)
            //     pacman.translate(pacmanSpeed, 0, 0)
            //     // pacman.transform.translate(pacmanSpeed, 0, 0)
            //     mvFlg = true
            //     pacmanMazeCoords[1] = pacmanMazeCoords[1] + 1
            // }
        }
        if(event.key == "ArrowDown") {
            if(pacman.config == 0) {
                mvFlg = moveOgDown(1)
            } else if(pacman.config == 1) {
                mvFlg = moveOgRight(1)
            } else if(pacman.config == 2) {
                mvFlg = moveOgUp(1)
            } else if(pacman.config == 3) {
                mvFlg = moveOgLeft(1)
            }
            // pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
            // pacman.locSetAngleAboutSetAxis(90 * Math.PI / 180)
            // pacman.transform.setAngleAboutSetAxis(pacman.locAngle)
            // // pacman.transform.setAngleAboutSetAxis(90 * Math.PI / 180)
            // if(mazeList[currMaze].layout[pacmanMazeCoords[0]+1][pacmanMazeCoords[1]] != 1) {
            //     // console.log(mazeList[currMaze].initPacmanMazeCoords)
            //     pacman.translate(0, pacmanSpeed, 0)
            //     // pacman.transform.translate(0, pacmanSpeed, 0)
            //     mvFlg = true
            //     pacmanMazeCoords[0] = pacmanMazeCoords[0] + 1
            // }
        }
        if(event.key == "ArrowLeft") {
            if(pacman.config == 0) {
                mvFlg = moveOgLeft(2)
            } else if(pacman.config == 1) {
                mvFlg = moveOgDown(2)
            } else if(pacman.config == 2) {
                mvFlg = moveOgRight(2)
            } else if(pacman.config == 3) {
                mvFlg = moveOgUp(2)
            }
            // pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
            // pacman.locSetAngleAboutSetAxis(-180 * Math.PI / 180)
            // pacman.transform.setAngleAboutSetAxis(pacman.locAngle)
            // // pacman.transform.setAngleAboutSetAxis(-180 * Math.PI / 180)
            // if(mazeList[currMaze].layout[pacmanMazeCoords[0]][pacmanMazeCoords[1]-1] != 1) {
            //     // console.log(mazeList[currMaze].initPacmanMazeCoords)
            //     pacman.translate(-pacmanSpeed, 0, 0)
            //     // pacman.transform.translate(-pacmanSpeed, 0, 0)
            //     mvFlg = true
            //     pacmanMazeCoords[1] = pacmanMazeCoords[1] - 1
            // }
        }

        if(mvFlg) {
            // for(var i = 0;i < mazeList[currMaze].nPltList.length;i++) {
            //     if(pacmanMazeCoords[0] == mazeList[currMaze].nPltList[i].mazeCoords[0] && pacmanMazeCoords[1] == mazeList[currMaze].nPltList[i].mazeCoords[1]) {
            //         mazeList[currMaze].nPltList[i].visit()
            //     }
            // }
            nPltUpdate()

            // for(var i = 0;i < mazeList[currMaze].pPltList.length;i++) {
            //     if(pacmanMazeCoords[0] == mazeList[currMaze].pPltList[i].mazeCoords[0] && pacmanMazeCoords[1] == mazeList[currMaze].pPltList[i].mazeCoords[1]) {
            //         pacman.transform.setScale(1.5, 1.5, 0)
            //         for(var j = 0;j < mazeList[currMaze].enemList.length;j++) {
            //             mazeList[currMaze].enemList[j].changeColor()
            //         }
            //         break
            //     }

            //     if(i == mazeList[currMaze].pPltList.length - 1) {
            //         pacman.transform.setScale(1.0, 1.0, 0)
            //         for(var j = 0;j < mazeList[currMaze].enemList.length;j++) {
            //             mazeList[currMaze].enemList[j].unchangeColor()
            //         }
            //     }
            // }
            pPltUpdate()

        }
        // up: x, y
        // right: -y, x
        // down: x, y
        // left: y, -x

        if(event.key == "[") {
            rotFlg = true
            // pacman.transform.setAngleAboutSetAxis(0)
            pacman.transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
            pacman.globRotAboutSetAxis(-90 * Math.PI / 180)
            pacman.transform.setAngleAboutSetAxis(pacman.globAngle)
            // pacman.transform.rotAboutSetAxis(-90 * Math.PI / 180)
            // var currTransVec = [pacman.transform.transVec[0], pacman.transform.transVec[1], pacman.transform.transVec[2]]
            // pacman.transform.translateTo(currTransVec[1], -currTransVec[0], currTransVec[2])
            if(pacman.config == 0) {
                pacman.config = 3
                mazeList[currMaze].config = 3
            } else {
                pacman.config = pacman.config - 1
                mazeList[currMaze].config = mazeList[currMaze].config - 1
            }
            // pacman.translate()
            // pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])

            for(var i = 0;i < mazeList[currMaze].enemList.length;i++) {
                // mazeList[currMaze].enemList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
                // mazeList[currMaze].enemList[i].globRotAboutSetAxis(-90 * Math.PI / 180)
                // mazeList[currMaze].enemList[i].transform.setAngleAboutSetAxis(mazeList[currMaze].enemList[i].globAngle)
                // mazeList[currMaze].enemList[i].transform.rotAboutSetAxis(-90 * Math.PI / 180)
                mazeList[currMaze].enemList[i].translate(mazeList[currMaze])
                // mazeList[currMaze].enemList[i].transform.rotAboutSetAxis(0 * Math.PI / 180)
            }

            for(var i = 0;i < mazeList[currMaze].nPltList.length;i++) {
                mazeList[currMaze].nPltList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
                mazeList[currMaze].nPltList[i].transform.rotAboutSetAxis(-90 * Math.PI / 180)
                // mazeList[currMaze].nPltList[i].transform.setRotPoint(mazeList[currMaze].primitiveList[i].center[0], mazeList[currMaze].primitiveList[i].center[1], mazeList[currMaze].primitiveList[i].center[2])
            }

            for(var i = 0;i < mazeList[currMaze].pPltList.length;i++) {
                mazeList[currMaze].pPltList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
                mazeList[currMaze].pPltList[i].transform.rotAboutSetAxis(-90 * Math.PI / 180)
                // mazeList[currMaze].pPltList[i].transform.setRotPoint(mazeList[currMaze].primitiveList[i].center[0], mazeList[currMaze].primitiveList[i].center[1], mazeList[currMaze].primitiveList[i].center[2])
            }

            for(var i = 0;i < mazeList[currMaze].wallList.length;i++) {
                mazeList[currMaze].wallList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
                mazeList[currMaze].wallList[i].transform.rotAboutSetAxis(-90 * Math.PI / 180)
                // mazeList[currMaze].wallList[i].transform.setRotPoint(mazeList[currMaze].primitiveList[i].center[0], mazeList[currMaze].primitiveList[i].center[1], mazeList[currMaze].primitiveList[i].center[2])
            }

            // for(var i = 0;i < mazeList[currMaze].primitiveList.length;i++) {
            //     mazeList[currMaze].primitiveList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
            //     mazeList[currMaze].primitiveList[i].transform.rotAboutSetAxis(-90 * Math.PI / 180)
            //     // mazeList[currMaze].primitiveList[i].transform.setRotPoint(mazeList[currMaze].primitiveList[i].center[0], mazeList[currMaze].primitiveList[i].center[1], mazeList[currMaze].primitiveList[i].center[2])
            // }
        }

        if(event.key == "]") {
            rotFlg = true
            // pacman.transform.setAngleAboutSetAxis(0)
            pacman.transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
            pacman.globRotAboutSetAxis(90 * Math.PI / 180)
            pacman.transform.setAngleAboutSetAxis(pacman.globAngle)
            // pacman.transform.rotAboutSetAxis(90 * Math.PI / 180)
            // var currTransVec = [pacman.transform.transVec[0], pacman.transform.transVec[1], pacman.transform.transVec[2]]
            // pacman.transform.translateTo(-currTransVec[1], currTransVec[0], currTransVec[2])
            if(pacman.config == 3) {
                pacman.config = 0
                mazeList[currMaze].config = 0
            } else {
                pacman.config = pacman.config + 1
                mazeList[currMaze].config = mazeList[currMaze].config + 1
            }
            // pacman.translate()
            // pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])

            for(var i = 0;i < mazeList[currMaze].enemList.length;i++) {
                // mazeList[currMaze].enemList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
                // mazeList[currMaze].enemList[i].globRotAboutSetAxis(90 * Math.PI / 180)
                // mazeList[currMaze].enemList[i].transform.setAngleAboutSetAxis(mazeList[currMaze].enemList[i].globAngle)
                // mazeList[currMaze].enemList[i].transform.rotAboutSetAxis(90 * Math.PI / 180)
                mazeList[currMaze].enemList[i].translate(mazeList[currMaze])
                // mazeList[currMaze].enemList[i].transform.rotAboutSetAxis(0 * Math.PI / 180)
            }

            for(var i = 0;i < mazeList[currMaze].nPltList.length;i++) {
                mazeList[currMaze].nPltList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
                mazeList[currMaze].nPltList[i].transform.rotAboutSetAxis(90 * Math.PI / 180)
                // mazeList[currMaze].nPltList[i].transform.setRotPoint(mazeList[currMaze].primitiveList[i].center[0], mazeList[currMaze].primitiveList[i].center[1], mazeList[currMaze].primitiveList[i].center[2])
            }

            for(var i = 0;i < mazeList[currMaze].pPltList.length;i++) {
                mazeList[currMaze].pPltList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
                mazeList[currMaze].pPltList[i].transform.rotAboutSetAxis(90 * Math.PI / 180)
                // mazeList[currMaze].pPltList[i].transform.setRotPoint(mazeList[currMaze].primitiveList[i].center[0], mazeList[currMaze].primitiveList[i].center[1], mazeList[currMaze].primitiveList[i].center[2])
            }

            for(var i = 0;i < mazeList[currMaze].wallList.length;i++) {
                mazeList[currMaze].wallList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
                mazeList[currMaze].wallList[i].transform.rotAboutSetAxis(90 * Math.PI / 180)
                // mazeList[currMaze].wallList[i].transform.setRotPoint(mazeList[currMaze].primitiveList[i].center[0], mazeList[currMaze].primitiveList[i].center[1], mazeList[currMaze].primitiveList[i].center[2])
            }

            // for(var i = 0;i < mazeList[currMaze].primitiveList.length;i++) {
            //     mazeList[currMaze].primitiveList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
            //     mazeList[currMaze].primitiveList[i].transform.rotAboutSetAxis(90 * Math.PI / 180)
            //     // mazeList[currMaze].primitiveList[i].transform.setRotPoint(mazeList[currMaze].primitiveList[i].center[0], mazeList[currMaze].primitiveList[i].center[1], mazeList[currMaze].primitiveList[i].center[2])
            // }
        }

        if(event.key == "c") {
            for(var i = 0;i < mazeList[currMaze].primitiveList.length;i++) {
                scene.remove(mazeList[currMaze].primitiveList[i])
            }
            scene.remove(pacman)
            if(currMaze == 2) {
                currMaze = 0
            } else {
                currMaze = currMaze + 1
            }
            for(var i = 0;i < mazeList[currMaze].primitiveList.length;i++) {
                scene.add(mazeList[currMaze].primitiveList[i])
            }
            var currPacmanCoords = pacmanMazeCoords
            pacmanMazeCoords = [mazeList[currMaze].initPacmanMazeCoords[0],
            mazeList[currMaze].initPacmanMazeCoords[1], mazeList[currMaze].initPacmanMazeCoords[2]]
            // console.log(mazeList[currMaze].initPacmanMazeCoords)
            // var tranDiff = [pacmanMazeCoords[1] - currPacmanCoords[1],
            // pacmanMazeCoords[0] - currPacmanCoords[0], pacmanMazeCoords[2] - currPacmanCoords[2]]
            // pacman.translate(tranDiff[0]*tileLength, tranDiff[1]*tileLength, tranDiff[2])
            // pacman.transform.translate(tranDiff[0]*tileLength, tranDiff[1]*tileLength, tranDiff[2])

            pacman.config = mazeList[currMaze].config
            
            scene.add(pacman)
        }

        pacman.configChange(rotFlg, pacmanMazeCoords, mazeList[currMaze])
    }

    if(event.key == "m") {
        if(moveMode == true) {
            moveMode = false
            console.log("Modify Mode started")
        } else {
            moveMode = true
            console.log("Move Mode started")
        }
    }
})

const canvasTopLeftOffset = [10, 10]
var pickPacman = false

document.addEventListener("click", event => {
    var mouseGridCoords = [pixelToGridCoords(event.clientX - canvasTopLeftOffset[0], event.clientY - canvasTopLeftOffset[1], 0)[0],
    pixelToGridCoords(event.clientX - canvasTopLeftOffset[0], event.clientY - canvasTopLeftOffset[1], 0)[1],
    pixelToGridCoords(event.clientX - canvasTopLeftOffset[0], event.clientY - canvasTopLeftOffset[1], 0)[2]]

    console.log(mouseGridCoords)
    console.log(pacmanMazeCoords)

    if(moveMode == false) {
        if(pacmanMazeCoords[0] == mouseGridCoords[0] && pacmanMazeCoords[1] == mouseGridCoords[1]) {
            console.log("hello")
            pickPacman = true
        } else if (pickPacman == true) {
            // console.log("hello")
            if(mazeList[currMaze].layout[mouseGridCoords[0]][mouseGridCoords[1]] != 1) {
                // var tranDiff = [mouseGridCoords[1] - pacmanMazeCoords[1],
                // mouseGridCoords[0] - pacmanMazeCoords[0], mouseGridCoords[2] - pacmanMazeCoords[2]]
                pacmanMazeCoords = [mouseGridCoords[0], mouseGridCoords[1], mouseGridCoords[2]]
                // pacman.translate(tranDiff[0]*tileLength, tranDiff[1]*tileLength, tranDiff[2])
                pacman.configChange(false, pacmanMazeCoords, mazeList[currMaze])
                nPltUpdate()
                pPltUpdate()
            }
            pickPacman = false
        }
    }
})

function pixelToGridCoords(x, y, z) {
    // console.log([mazeList[currMaze].getOffset()[1], mazeList[currMaze].getOffset()[0]])
    // console.log([y, x])
    if(pacman.config == 0) {
        const gridX = Math.floor((y - mazeList[currMaze].getOffset()[1])/tileLength)
        const gridY = Math.floor((x - mazeList[currMaze].getOffset()[0])/tileLength)
        const gridZ = 0

        return [gridX, gridY, gridZ]
    }
    if(pacman.config == 1) {
        const gridX = Math.floor((y - mazeList[currMaze].getOffset()[1])/tileLength)
        const gridY = Math.floor((x - mazeList[currMaze].getOffset()[0])/tileLength)
        const gridZ = 0

        return [mazeList[currMaze].layout.length - 1 - gridY, gridX, gridZ]
    }
    if(pacman.config == 2) {
        const gridX = Math.floor((y - mazeList[currMaze].getOffset()[1])/tileLength)
        const gridY = Math.floor((x - mazeList[currMaze].getOffset()[0])/tileLength)
        const gridZ = 0

        return [mazeList[currMaze].layout.length - 1 - gridX, mazeList[currMaze].layout[0].length - 1 - gridY, gridZ]
    }
    if(pacman.config == 3) {
        const gridX = Math.floor((y - mazeList[currMaze].getOffset()[1])/tileLength)
        const gridY = Math.floor((x - mazeList[currMaze].getOffset()[0])/tileLength)
        const gridZ = 0

        return [gridY, mazeList[currMaze].layout[0].length - 1 - gridX, gridZ]
    }
}

function nPltUpdate() {
    for(var i = 0;i < mazeList[currMaze].nPltList.length;i++) {
        if(pacmanMazeCoords[0] == mazeList[currMaze].nPltList[i].mazeCoords[0] && pacmanMazeCoords[1] == mazeList[currMaze].nPltList[i].mazeCoords[1]) {
            mazeList[currMaze].nPltList[i].visit()
        }
    }
}

function pPltUpdate() {
    for(var i = 0;i < mazeList[currMaze].pPltList.length;i++) {
        if(pacmanMazeCoords[0] == mazeList[currMaze].pPltList[i].mazeCoords[0] && pacmanMazeCoords[1] == mazeList[currMaze].pPltList[i].mazeCoords[1]) {
            pacman.transform.setScale(1.5, 1.5, 0)
            for(var j = 0;j < mazeList[currMaze].enemList.length;j++) {
                mazeList[currMaze].enemList[j].changeColor()
            }
            break
        }

        if(i == mazeList[currMaze].pPltList.length - 1) {
            pacman.transform.setScale(1.0, 1.0, 0)
            for(var j = 0;j < mazeList[currMaze].enemList.length;j++) {
                mazeList[currMaze].enemList[j].unchangeColor()
            }
        }
    }
}

function moveOgRight(scrnDir) {
    pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
    pacman.locSetAngleAboutSetAxis(scrnDir * 90 * Math.PI / 180)
    pacman.transform.setAngleAboutSetAxis(pacman.locAngle)
    // pacman.transform.setAngleAboutSetAxis(0 * Math.PI / 180)
    if(mazeList[currMaze].layout[pacmanMazeCoords[0]][pacmanMazeCoords[1]+1] != 1) {
        // console.log(mazeList[currMaze].initPacmanMazeCoords)
        pacman.translate(pacmanSpeed, 0, 0)
        // pacman.transform.translate(pacmanSpeed, 0, 0)
        pacmanMazeCoords[1] = pacmanMazeCoords[1] + 1
        return true
    }
    return false
}

function moveOgLeft(scrnDir) {
    pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
    pacman.locSetAngleAboutSetAxis(scrnDir * 90 * Math.PI / 180)
    pacman.transform.setAngleAboutSetAxis(pacman.locAngle)
    // pacman.transform.setAngleAboutSetAxis(-180 * Math.PI / 180)
    if(mazeList[currMaze].layout[pacmanMazeCoords[0]][pacmanMazeCoords[1]-1] != 1) {
        // console.log(mazeList[currMaze].initPacmanMazeCoords)
        pacman.translate(-pacmanSpeed, 0, 0)
        // pacman.transform.translate(-pacmanSpeed, 0, 0)
        pacmanMazeCoords[1] = pacmanMazeCoords[1] - 1
        return true
    }
    return false
}

function moveOgUp(scrnDir, mvFlg) {
    pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
    pacman.locSetAngleAboutSetAxis(scrnDir * 90 * Math.PI / 180)
    pacman.transform.setAngleAboutSetAxis(pacman.locAngle)
    // pacman.transform.setAngleAboutSetAxis(-90 * Math.PI / 180)
    if(mazeList[currMaze].layout[pacmanMazeCoords[0]-1][pacmanMazeCoords[1]] != 1) {
        // console.log(mazeList[currMaze].initPacmanMazeCoords)
        pacman.translate(0, -pacmanSpeed, 0)
        // pacman.transform.translate(0, -pacmanSpeed, 0)
        pacmanMazeCoords[0] = pacmanMazeCoords[0] - 1
        return true
    }
    return false
}

function moveOgDown(scrnDir, mvFlg) {
    pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
    pacman.locSetAngleAboutSetAxis(scrnDir * 90 * Math.PI / 180)
    pacman.transform.setAngleAboutSetAxis(pacman.locAngle)
    // pacman.transform.setAngleAboutSetAxis(90 * Math.PI / 180)
    if(mazeList[currMaze].layout[pacmanMazeCoords[0]+1][pacmanMazeCoords[1]] != 1) {
        // console.log(mazeList[currMaze].initPacmanMazeCoords)
        pacman.translate(0, pacmanSpeed, 0)
        // pacman.transform.translate(0, pacmanSpeed, 0)
        pacmanMazeCoords[0] = pacmanMazeCoords[0] + 1
        return true
    }
    return false
}


renderer.setAnimationLoop(animation);

//Draw loop
function animation() 
{
    renderer.clear(0.8, 0.8, 0.8, 1);
    renderer.render(scene, shader);
}
