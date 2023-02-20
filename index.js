import { Scene } from './lib/scene.js'
import { WebGLRenderer } from './lib/renderer.js'
import { Shader } from './lib/shader.js'
import { vertexShaderSrc    } from './shaders/vertex.js';
import { fragmentShaderSrc } from './shaders/fragment.js';
import { Circle } from './lib/circle.js';
import { maze1 } from './lib/maze1.js';
import { maze2 } from './lib/maze2.js';
import { maze3 } from './lib/maze3.js';
import { Maze } from './lib/maze.js';


const renderer = new WebGLRenderer();

// canvas dimensions
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

// tile length of each tile of the maze
const tileLength = 30
var m1 = new Maze(maze1, tileLength, 'maze1', [width, height, 0], true)
var m2 = new Maze(maze2, tileLength, 'maze2', [width, height, 0], true)
var m3 = new Maze(maze3, tileLength, 'maze3', [width, height, 0], true)

// the maze list contains all the different maze configurations
// curr maze stores the index of the maze being sent into the scene
var mazeList = [m1, m2, m3]
var currMaze = 0
// adding the maze onto the scene
for(var i = 0;i < mazeList[currMaze].primitiveList.length;i++) {
    scene.add(mazeList[currMaze].primitiveList[i])
}

// the pacman object is a circle with radius 10
// and appropriate center as given by the maze
const pacman = new Circle(
    10,
    [mazeList[currMaze].widthOffset + mazeList[currMaze].initPacmanMazeCoords[1]*tileLength + tileLength/2,
    mazeList[currMaze].heightOffset + mazeList[currMaze].initPacmanMazeCoords[0]*tileLength + tileLength/2,
    mazeList[currMaze].initPacmanMazeCoords[2]],
    [1.0, 1.0, 0.0, 1]
)
pacman.mazeCoords = [mazeList[currMaze].initPacmanMazeCoords[0],
mazeList[currMaze].initPacmanMazeCoords[1], mazeList[currMaze].initPacmanMazeCoords[2]]
const pacmanSpeed = tileLength
// adding the pacman to the scene
scene.add(pacman)

// moveMode is used to toggle between normal and modify mode
var moveMode = true

// stores if the pacman is on a power pellet or not
var onAPowerPellet = false

// controls all the keyboard inputs
document.addEventListener("keydown", event => {
    // mvFlg stores if the pacman has moved with the current keystroke or not
    var mvFlg = false

    // rotFlg stores if the maze has been rotated in this keystroke or not
    var rotFlg = false
    pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])

    // following actions will take place if moveMode is on
    if(moveMode) {
        // ( and ) can be used to rotate pacman by + or - 45 degrees
        if(event.key == "(" && onAPowerPellet == false) {
            pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
            pacman.locAddRot(-45 * Math.PI / 180)
            pacman.transform.setAngle(pacman.locAngle)
        }
        if(event.key == ")" && onAPowerPellet == false) {
            pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
            pacman.locAddRot(45 * Math.PI / 180)
            pacman.transform.setAngle(pacman.locAngle)
        }

        // when arrow keys are pressed, appropriate pacman coordinates are calculated
        // according to the orientation and then the pacman is moved
        // the details about the orientation are given in the maze.js file
        if(event.key == "ArrowUp") {
            if(pacman.orientation == 0) {
                mvFlg = moveOgUp(3)
            } else if(pacman.orientation == 1) {
                mvFlg = moveOgLeft(3)
            } else if(pacman.orientation == 2) {
                mvFlg = moveOgDown(3)
            } else if(pacman.orientation == 3) {
                mvFlg = moveOgRight(3)
            }
        }
        if(event.key == "ArrowRight") {
            if(pacman.orientation == 0) {
                mvFlg = moveOgRight(0)
            } else if(pacman.orientation == 1) {
                mvFlg = moveOgUp(0)
            } else if(pacman.orientation == 2) {
                mvFlg = moveOgLeft(0)
            } else if(pacman.orientation == 3) {
                mvFlg = moveOgDown(0)
            }
        }
        if(event.key == "ArrowDown") {
            if(pacman.orientation == 0) {
                mvFlg = moveOgDown(1)
            } else if(pacman.orientation == 1) {
                mvFlg = moveOgRight(1)
            } else if(pacman.orientation == 2) {
                mvFlg = moveOgUp(1)
            } else if(pacman.orientation == 3) {
                mvFlg = moveOgLeft(1)
            }
        }
        if(event.key == "ArrowLeft") {
            if(pacman.orientation == 0) {
                mvFlg = moveOgLeft(2)
            } else if(pacman.orientation == 1) {
                mvFlg = moveOgDown(2)
            } else if(pacman.orientation == 2) {
                mvFlg = moveOgRight(2)
            } else if(pacman.orientation == 3) {
                mvFlg = moveOgUp(2)
            }
        }

        // if the pacman moves after the arrows keys are pressed then
        // the pellets and pacman are updated accordingly
        if(mvFlg) {
            nPltUpdate()
            pPltUpdate()
        }

        // [ and ] can be used to rotate the maze clockwise and anticlockwise
        // these moves can be made only when the pacman is not on a power pellet
        if(event.key == "[" && onAPowerPellet == false) {
            // the rotFlg is raised
            rotFlg = true
            
            // the pacman is rotated with the appropriate axis and angle
            pacman.transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
            pacman.globAddRot(-90 * Math.PI / 180)
            pacman.transform.setAngle(pacman.globAngle)

            // the pacman and the maze configurations are updates
            if(pacman.orientation == 0) {
                pacman.orientation = 3
                mazeList[currMaze].orientation = 3
            } else {
                pacman.orientation = pacman.orientation - 1
                mazeList[currMaze].orientation = mazeList[currMaze].orientation - 1
            }

            // the enemies are moved into their new positions
            for(var i = 0;i < mazeList[currMaze].enemList.length;i++) {
                mazeList[currMaze].enemList[i].translate(mazeList[currMaze])
            }

            // the normal pellets are moved into their new positions
            for(var i = 0;i < mazeList[currMaze].nPltList.length;i++) {
                mazeList[currMaze].nPltList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
                mazeList[currMaze].nPltList[i].transform.addRot(-90 * Math.PI / 180)
            }

            // the power pellets are moved into their new positions
            for(var i = 0;i < mazeList[currMaze].pPltList.length;i++) {
                mazeList[currMaze].pPltList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
                mazeList[currMaze].pPltList[i].transform.addRot(-90 * Math.PI / 180)
            }

            // the walls are moved into their new positions
            for(var i = 0;i < mazeList[currMaze].wallList.length;i++) {
                mazeList[currMaze].wallList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
                mazeList[currMaze].wallList[i].transform.addRot(-90 * Math.PI / 180)
            }

        }

        if(event.key == "]" && onAPowerPellet == false) {
            // rotFlg is raised
            rotFlg = true

            // the pacman is rotated with the appropriate axis and angle
            pacman.transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
            pacman.globAddRot(90 * Math.PI / 180)
            pacman.transform.setAngle(pacman.globAngle)

            // the pacman and the maze configurations are updates
            if(pacman.orientation == 3) {
                pacman.orientation = 0
                mazeList[currMaze].orientation = 0
            } else {
                pacman.orientation = pacman.orientation + 1
                mazeList[currMaze].orientation = mazeList[currMaze].orientation + 1
            }

            // the enemies are moved into their new positions            
            for(var i = 0;i < mazeList[currMaze].enemList.length;i++) {
                mazeList[currMaze].enemList[i].translate(mazeList[currMaze])
            }

            // the normal pellets are moved into their new positions
            for(var i = 0;i < mazeList[currMaze].nPltList.length;i++) {
                mazeList[currMaze].nPltList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
                mazeList[currMaze].nPltList[i].transform.addRot(90 * Math.PI / 180)
            }

            // the power pellets are moved into their new positions
            for(var i = 0;i < mazeList[currMaze].pPltList.length;i++) {
                mazeList[currMaze].pPltList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
                mazeList[currMaze].pPltList[i].transform.addRot(90 * Math.PI / 180)
            }

            // the walls are moved into their new positions            
            for(var i = 0;i < mazeList[currMaze].wallList.length;i++) {
                mazeList[currMaze].wallList[i].transform.setRotPoint(mazeList[currMaze].mazeCenter[0], mazeList[currMaze].mazeCenter[1], mazeList[currMaze].mazeCenter[2])
                mazeList[currMaze].wallList[i].transform.addRot(90 * Math.PI / 180)
            }

        }

        // the maze layout is changed
        if(event.key == "c" && onAPowerPellet == false) {
            // the current maze is removed from the scene
            for(var i = 0;i < mazeList[currMaze].primitiveList.length;i++) {
                scene.remove(mazeList[currMaze].primitiveList[i])
            }

            // the normal pellets are reset
            for(var i = 0;i < mazeList[currMaze].nPltList.length;i++) {
                mazeList[currMaze].nPltList[i].unvisit()
            }

            // the maze is reset
            mazeList[currMaze].resetMaze()

            // the pacman is removed from the scene
            scene.remove(pacman)

            // the currMaze index is updated
            if(currMaze == 2) {
                currMaze = 0
            } else {
                currMaze = currMaze + 1
            }

            // the new maze is added to the scene
            for(var i = 0;i < mazeList[currMaze].primitiveList.length;i++) {
                scene.add(mazeList[currMaze].primitiveList[i])
            }

            // the pacman's maze coordinated are updated
            pacman.mazeCoords = [mazeList[currMaze].initPacmanMazeCoords[0],
            mazeList[currMaze].initPacmanMazeCoords[1], mazeList[currMaze].initPacmanMazeCoords[2]]

            // the pacman faces in the normal direction
            pacman.transform.setAngle(0)

            // the orientation and the global angle of the pacman are reset
            pacman.orientation = 0
            pacman.globSetAngle(0)
            
            // pacman is added back to the scene
            scene.add(pacman)
        }

        // updates related to the movements are made to the pacman
        pacman.update(rotFlg, pacman.mazeCoords, mazeList[currMaze])
    }

    // modify mode is toggled
    if(event.key == "m") {
        if(moveMode == true) {
            moveMode = false
            console.log("Modify Mode started")
        } else {
            moveMode = true
            console.log("Move Mode started")
            if(pickPacman == true) {
                // use the coordinate buffer to replace the pacman
                pacman.mazeCoords = [pacmanCoordBuffer[0], pacmanCoordBuffer[1], pacmanCoordBuffer[2]]
                pacman.update(false, pacman.mazeCoords, mazeList[currMaze])
            }
        }
    }
})

// this is the top left offset of the canvas object on the browser window
const canvasTopLeftOffset = [10, 10]
// this 
var pickPacman = false
// coordinate buffer to make the modfication step interactive
var pacmanCoordBuffer = []

// mouse events are handled here
document.addEventListener("click", event => {
    // this is executed only if the modify mode is on
    if(moveMode == false) {
        // the mouse grid coordinated are translated to the original orientation and returned
        var mouseGridCoords = [pixelToGridCoords(event.clientX - canvasTopLeftOffset[0],event.clientY - canvasTopLeftOffset[1], 0)[0],
        pixelToGridCoords(event.clientX - canvasTopLeftOffset[0], event.clientY - canvasTopLeftOffset[1], 0)[1],
        pixelToGridCoords(event.clientX - canvasTopLeftOffset[0], event.clientY - canvasTopLeftOffset[1], 0)[2]]

        // if pacman has not been picked up
        if(pickPacman == false && pacman.mazeCoords[0] == mouseGridCoords[0] && pacman.mazeCoords[1] == mouseGridCoords[1]) {
            // pacman is picked if clicked correctly
            pickPacman = true
            // coordinates are stored
            pacmanCoordBuffer = [pacman.mazeCoords[0], pacman.mazeCoords[1], pacman.mazeCoords[2]]
        } else if(pickPacman == true) {
            // if the point is accessible, place the pacman otherwise, replace it back
            if(mazeList[currMaze].layout[mouseGridCoords[0]][mouseGridCoords[1]] != 1) {
                pacman.mazeCoords = [mouseGridCoords[0], mouseGridCoords[1], mouseGridCoords[2]]
                pacman.update(false, pacman.mazeCoords, mazeList[currMaze])

                // interact with pellets accordingly
                nPltUpdate()
                pPltUpdate()
            } else {
                // use the coordinate buffer to replace the pacman
                pacman.mazeCoords = [pacmanCoordBuffer[0], pacmanCoordBuffer[1], pacmanCoordBuffer[2]]
                pacman.update(false, pacman.mazeCoords, mazeList[currMaze])
            }

            // unpick the pacman
            pickPacman = false
        }
    }
})

document.addEventListener('mousemove', event => {
    // this is executed only if the modify mode is on
    if(moveMode == false) {
        // the mouse grid coordinated are translated to the original orientation and returned
        var mouseGridCoords = [pixelToGridCoords(event.clientX - canvasTopLeftOffset[0],event.clientY - canvasTopLeftOffset[1], 0)[0],
        pixelToGridCoords(event.clientX - canvasTopLeftOffset[0], event.clientY - canvasTopLeftOffset[1], 0)[1],
        pixelToGridCoords(event.clientX - canvasTopLeftOffset[0], event.clientY - canvasTopLeftOffset[1], 0)[2]]

        // if pacman is picked, 
        if(pickPacman == true) {
            if(mazeList[currMaze].layout[mouseGridCoords[0]][mouseGridCoords[1]] != 1) {
                pacman.mazeCoords = [mouseGridCoords[0], mouseGridCoords[1], mouseGridCoords[2]]
                pacman.update(false, pacman.mazeCoords, mazeList[currMaze])
            }
        }
    }
})

// this function returns grid coords in the original orientation
// when given any position on the screen
function pixelToGridCoords(x, y, z) {
    const gridX = Math.floor((y - mazeList[currMaze].getOffset()[1])/tileLength)
    const gridY = Math.floor((x - mazeList[currMaze].getOffset()[0])/tileLength)
    const gridZ = 0

    if(pacman.orientation == 0) {
        return [gridX, gridY, gridZ]
    } else if(pacman.orientation == 1) {
        return [mazeList[currMaze].layout.length - 1 - gridY, gridX, gridZ]
    } else if(pacman.orientation == 2) {
        return [mazeList[currMaze].layout.length - 1 - gridX, mazeList[currMaze].layout[0].length - 1 - gridY, gridZ]
    } else if(pacman.orientation == 3) {
        return [gridY, mazeList[currMaze].layout[0].length - 1 - gridX, gridZ]
    }
}

// this function handles the normal pellets interactions
function nPltUpdate() {
    for(var i = 0;i < mazeList[currMaze].nPltList.length;i++) {
        if(pacman.mazeCoords[0] == mazeList[currMaze].nPltList[i].mazeCoords[0] && pacman.mazeCoords[1] == mazeList[currMaze].nPltList[i].mazeCoords[1]) {
            mazeList[currMaze].nPltList[i].visit()
        }
    }
}

// this function handles the power pellets interactions
function pPltUpdate() {
    for(var i = 0;i < mazeList[currMaze].pPltList.length;i++) {
        if(pacman.mazeCoords[0] == mazeList[currMaze].pPltList[i].mazeCoords[0] && pacman.mazeCoords[1] == mazeList[currMaze].pPltList[i].mazeCoords[1]) {
            pacman.transform.setScale(1.5, 1.5, 1.5)
            for(var j = 0;j < mazeList[currMaze].enemList.length;j++) {
                mazeList[currMaze].enemList[j].changeColor()
            }
            onAPowerPellet = true
            break
        }

        if(i == mazeList[currMaze].pPltList.length - 1) {
            pacman.transform.setScale(1.0, 1.0, 1.0)
            for(var j = 0;j < mazeList[currMaze].enemList.length;j++) {
                mazeList[currMaze].enemList[j].unchangeColor()
            }
            onAPowerPellet = false
        }
    }
}

// this function moves the pacman right on the original grid
function moveOgRight(scrnDir) {
    pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
    pacman.locSetAngle(scrnDir * 90 * Math.PI / 180)
    pacman.transform.setAngle(pacman.locAngle)
    if(mazeList[currMaze].layout[pacman.mazeCoords[0]][pacman.mazeCoords[1]+1] != 1) {
        pacman.translate(pacmanSpeed, 0, 0)
        pacman.mazeCoords[1] = pacman.mazeCoords[1] + 1
        return true
    }
    return false
}

// this function moves the pacman left on the original grid
function moveOgLeft(scrnDir) {
    pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
    pacman.locSetAngle(scrnDir * 90 * Math.PI / 180)
    pacman.transform.setAngle(pacman.locAngle)
    if(mazeList[currMaze].layout[pacman.mazeCoords[0]][pacman.mazeCoords[1]-1] != 1) {
        pacman.translate(-pacmanSpeed, 0, 0)
        pacman.mazeCoords[1] = pacman.mazeCoords[1] - 1
        return true
    }
    return false
}

// this function moves the pacman up on the original grid
function moveOgUp(scrnDir) {
    pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
    pacman.locSetAngle(scrnDir * 90 * Math.PI / 180)
    pacman.transform.setAngle(pacman.locAngle)
    if(mazeList[currMaze].layout[pacman.mazeCoords[0]-1][pacman.mazeCoords[1]] != 1) {
        pacman.translate(0, -pacmanSpeed, 0)
        pacman.mazeCoords[0] = pacman.mazeCoords[0] - 1
        return true
    }
    return false
}

// this function moves the pacman down on the original grid
function moveOgDown(scrnDir) {
    pacman.transform.setRotPoint(pacman.center[0], pacman.center[1], pacman.center[2])
    pacman.locSetAngle(scrnDir * 90 * Math.PI / 180)
    pacman.transform.setAngle(pacman.locAngle)
    if(mazeList[currMaze].layout[pacman.mazeCoords[0]+1][pacman.mazeCoords[1]] != 1) {
        pacman.translate(0, pacmanSpeed, 0)
        pacman.mazeCoords[0] = pacman.mazeCoords[0] + 1
        return true
    }
    return false
}


renderer.setAnimationLoop(animation);

function animation() 
{
    // the background color changes to
    // indicate toggling the modify mode
    if(moveMode) {
        renderer.clear(0.0, 0.0, 0.0, 1);
    } else {
        renderer.clear(0.2, 0.2, 0.2, 1);
    }
    renderer.render(scene, shader);
}
