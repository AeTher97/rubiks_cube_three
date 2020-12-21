import {GLTFLoader} from "../build/GLTFLoader.js";
import {Vector3} from "../build/three.module.js";

const loader = new GLTFLoader();

export let cubeObjects;

export const renderCube = (scene) => {
    loader.load('./models/cube.glb', function (gltf) {
        const length = gltf.scene.children.length;


        const tempArray = [...gltf.scene.children];
        for (let i = 0; i < length; i++) {
            scene.add(tempArray[i]);
        }

        cubeObjects = [
            [
                tempArray[19],
                tempArray[20],
                tempArray[21],
                tempArray[22],
                tempArray[23],
                tempArray[24],
                tempArray[25],
                tempArray[26],
                tempArray[27],
            ],
            [
                tempArray[11],
                tempArray[12],
                tempArray[13],
                tempArray[14],
                undefined,
                tempArray[15],
                tempArray[16],
                tempArray[17],
                tempArray[18],
            ],
            [
                tempArray[2],
                tempArray[3],
                tempArray[4],
                tempArray[5],
                tempArray[6],
                tempArray[7],
                tempArray[8],
                tempArray[9],
                tempArray[10],
            ]
        ]


    }, undefined, function (error) {

        console.error(error);

    });
}

const rotateObject = (object, angle, axis) => {

    let axisVector;
    if (axis.toUpperCase() === 'X') {
        axisVector = new Vector3(1, 0, 0);
    } else if (axis.toUpperCase() === 'Y') {
        axisVector = new Vector3(0, 1, 0);
    } else if (axis.toUpperCase() === 'Z') {
        axisVector = new Vector3(0, 0, 1);
    }

    object.position.sub(new Vector3());
    object.position.applyAxisAngle(axisVector, angle);
    object.position.add(new Vector3());


    object.rotateOnWorldAxis(axisVector, angle);
}

export const rotateWall = (wall, angle, clockwise = true) => {
    let objectsToRotate;
    let axis;

    if (wall.toUpperCase() === 'F') {
        axis = 'z';
        objectsToRotate = [
            cubeObjects[0][0],
            cubeObjects[0][1],
            cubeObjects[0][2],
            cubeObjects[1][0],
            cubeObjects[1][1],
            cubeObjects[1][2],
            cubeObjects[2][0],
            cubeObjects[2][1],
            cubeObjects[2][2],
        ]
    } else if (wall.toUpperCase() === 'R') {
        axis = 'x';
        objectsToRotate = [
            cubeObjects[0][2],
            cubeObjects[0][5],
            cubeObjects[0][8],
            cubeObjects[1][2],
            cubeObjects[1][5],
            cubeObjects[1][8],
            cubeObjects[2][2],
            cubeObjects[2][5],
            cubeObjects[2][8],
        ]
    } else if (wall.toUpperCase() === 'L') {
        axis = 'x';
        angle = -angle;
        objectsToRotate = [
            cubeObjects[0][0],
            cubeObjects[0][3],
            cubeObjects[0][6],
            cubeObjects[1][0],
            cubeObjects[1][3],
            cubeObjects[1][6],
            cubeObjects[2][0],
            cubeObjects[2][3],
            cubeObjects[2][6],
        ]
    } else if (wall.toUpperCase() === 'U') {
        axis = 'y';
        objectsToRotate = [
            ...cubeObjects[0]
        ]
    } else if (wall.toUpperCase() === 'D') {
        axis = 'y';
        angle = -angle;
        objectsToRotate = [
            ...cubeObjects[2]
        ]
    } else if (wall.toUpperCase() === 'B') {
        axis = 'z';
        angle = -angle;
        objectsToRotate = [
            cubeObjects[0][6],
            cubeObjects[0][7],
            cubeObjects[0][8],
            cubeObjects[1][6],
            cubeObjects[1][7],
            cubeObjects[1][8],
            cubeObjects[2][6],
            cubeObjects[2][7],
            cubeObjects[2][8],
        ]
    }

    objectsToRotate.forEach(object => {
        rotateObject(object, clockwise ? -angle : angle, axis);
    })

}

export const snapRotation = (wall, clockwise = true) => {

    if (wall.toUpperCase() === 'F' && clockwise) {
        let temp = cubeObjects[0][2];
        cubeObjects[0][2] = cubeObjects[0][0];
        cubeObjects[0][0] = cubeObjects[2][0];
        cubeObjects[2][0] = cubeObjects[2][2];
        cubeObjects[2][2] = temp;
        temp = cubeObjects[0][1];
        cubeObjects[0][1] = cubeObjects[1][0];
        cubeObjects[1][0] = cubeObjects[2][1];
        cubeObjects[2][1] = cubeObjects[1][2];
        cubeObjects[1][2] = temp;
    } else if (wall.toUpperCase() === 'F' && !clockwise) {
        let temp = cubeObjects[0][2];
        cubeObjects[0][2] = cubeObjects[2][2];
        cubeObjects[2][2] = cubeObjects[2][0];
        cubeObjects[2][0] = cubeObjects[0][0];
        cubeObjects[0][0] = temp;
        temp = cubeObjects[0][1];
        cubeObjects[0][1] = cubeObjects[1][2];
        cubeObjects[1][2] = cubeObjects[2][1];
        cubeObjects[2][1] = cubeObjects[1][0];
        cubeObjects[1][0] = temp;
    } else if (wall.toUpperCase() === 'R' && clockwise) {
        let temp = cubeObjects[0][2];
        cubeObjects[0][2] = cubeObjects[2][2];
        cubeObjects[2][2] = cubeObjects[2][8];
        cubeObjects[2][8] = cubeObjects[0][8];
        cubeObjects[0][8] = temp;
        temp = cubeObjects[1][2];
        cubeObjects[1][2] = cubeObjects[2][5];
        cubeObjects[2][5] = cubeObjects[1][8];
        cubeObjects[1][8] = cubeObjects[0][5];
        cubeObjects[0][5] = temp;
    } else if (wall.toUpperCase() === 'R' && !clockwise) {
        let temp = cubeObjects[0][2];
        cubeObjects[0][2] = cubeObjects[0][8];
        cubeObjects[0][8] = cubeObjects[2][8];
        cubeObjects[2][8] = cubeObjects[2][2];
        cubeObjects[2][2] = temp;
        temp = cubeObjects[1][2];
        cubeObjects[1][2] = cubeObjects[0][5];
        cubeObjects[0][5] = cubeObjects[1][8];
        cubeObjects[1][8] = cubeObjects[2][5];
        cubeObjects[2][5] = temp;
    } else if (wall.toUpperCase() === 'L' && clockwise) {
        let temp = cubeObjects[0][0];
        cubeObjects[0][0] = cubeObjects[0][6];
        cubeObjects[0][6] = cubeObjects[2][6];
        cubeObjects[2][6] = cubeObjects[2][0];
        cubeObjects[2][0] = temp;
        temp = cubeObjects[1][0];
        cubeObjects[1][0] = cubeObjects[0][3];
        cubeObjects[0][3] = cubeObjects[1][6];
        cubeObjects[1][6] = cubeObjects[2][3];
        cubeObjects[2][3] = temp;
    } else if (wall.toUpperCase() === 'L' && !clockwise) {
        let temp = cubeObjects[0][0];
        cubeObjects[0][0] = cubeObjects[2][0];
        cubeObjects[2][0] = cubeObjects[2][6];
        cubeObjects[2][6] = cubeObjects[0][6];
        cubeObjects[0][6] = temp;
        temp = cubeObjects[1][0];
        cubeObjects[1][0] = cubeObjects[2][3];
        cubeObjects[2][3] = cubeObjects[1][6];
        cubeObjects[1][6] = cubeObjects[0][3];
        cubeObjects[0][3] = temp;
    } else if (wall.toUpperCase() === 'U' && !clockwise) {
        let temp = cubeObjects[0][2];
        cubeObjects[0][2] = cubeObjects[0][0];
        cubeObjects[0][0] = cubeObjects[0][6];
        cubeObjects[0][6] = cubeObjects[0][8];
        cubeObjects[0][8] = temp;
        temp = cubeObjects[0][1];
        cubeObjects[0][1] = cubeObjects[0][3];
        cubeObjects[0][3] = cubeObjects[0][7];
        cubeObjects[0][7] = cubeObjects[0][5];
        cubeObjects[0][5] = temp;
    } else if (wall.toUpperCase() === 'U' && clockwise) {
        let temp = cubeObjects[0][2];
        cubeObjects[0][2] = cubeObjects[0][8];
        cubeObjects[0][8] = cubeObjects[0][6];
        cubeObjects[0][6] = cubeObjects[0][0];
        cubeObjects[0][0] = temp;
        temp = cubeObjects[0][1];
        cubeObjects[0][1] = cubeObjects[0][5];
        cubeObjects[0][5] = cubeObjects[0][7];
        cubeObjects[0][7] = cubeObjects[0][3];
        cubeObjects[0][3] = temp;
    } else if (wall.toUpperCase() === 'D' && clockwise) {
        let temp = cubeObjects[2][2];
        cubeObjects[2][2] = cubeObjects[2][0];
        cubeObjects[2][0] = cubeObjects[2][6];
        cubeObjects[2][6] = cubeObjects[2][8];
        cubeObjects[2][8] = temp;
        temp = cubeObjects[2][1];
        cubeObjects[2][1] = cubeObjects[2][3];
        cubeObjects[2][3] = cubeObjects[2][7];
        cubeObjects[2][7] = cubeObjects[2][5];
        cubeObjects[2][5] = temp;
    } else if (wall.toUpperCase() === 'D' && !clockwise) {
        let temp = cubeObjects[2][2];
        cubeObjects[2][2] = cubeObjects[2][8];
        cubeObjects[2][8] = cubeObjects[2][6];
        cubeObjects[2][6] = cubeObjects[2][0];
        cubeObjects[2][0] = temp;
        temp = cubeObjects[2][1];
        cubeObjects[2][1] = cubeObjects[2][5];
        cubeObjects[2][5] = cubeObjects[2][7];
        cubeObjects[2][7] = cubeObjects[2][3];
        cubeObjects[2][3] = temp;
    } else if (wall.toUpperCase() === 'B' && !clockwise) {
        let temp = cubeObjects[0][8];
        cubeObjects[0][8] = cubeObjects[0][6];
        cubeObjects[0][6] = cubeObjects[2][6];
        cubeObjects[2][6] = cubeObjects[2][8];
        cubeObjects[2][8] = temp;
        temp = cubeObjects[0][7];
        cubeObjects[0][7] = cubeObjects[1][6];
        cubeObjects[1][6] = cubeObjects[2][7];
        cubeObjects[2][7] = cubeObjects[1][8];
        cubeObjects[1][8] = temp;
    } else if (wall.toUpperCase() === 'B' && clockwise) {
        let temp = cubeObjects[0][8];
        cubeObjects[0][8] = cubeObjects[2][8];
        cubeObjects[2][8] = cubeObjects[2][6];
        cubeObjects[2][6] = cubeObjects[0][6];
        cubeObjects[0][6] = temp;
        temp = cubeObjects[0][7];
        cubeObjects[0][7] = cubeObjects[1][8];
        cubeObjects[1][8] = cubeObjects[2][7];
        cubeObjects[2][7] = cubeObjects[1][6];
        cubeObjects[1][6] = temp;
    }

}

const getCornerVectors = (x, y, point) => {
    if (x === 0 && y === 0) {
        if (point.z > 3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'U',
                clockwise: true
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'U',
                clockwise: false
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'L',
                clockwise: true
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'L',
                clockwise: false
            }]
        }
        if (point.x < -3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'U',
                clockwise: true
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'U',
                clockwise: false
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'F',
                clockwise: true
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'F',
                clockwise: false
            }]
        }
        if (point.y > 3.09) {
            return [{
                vector: new Vector3(0, 0, -10),
                direction: 'L',
                clockwise: true
            }, {
                vector: new Vector3(0, 0, 10),
                direction: 'L',
                clockwise: false
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'F',
                clockwise: true
            }, {
                vector: new Vector3(10, 0, 0),
                direction: 'F',
                clockwise: false
            }]
        }
    } else if (x === 0 && y === 6) {
        if (point.z < -3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'U',
                clockwise: false
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'U',
                clockwise: true
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'L',
                clockwise: false
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'L',
                clockwise: true
            }]
        }
        if (point.x < -3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'U',
                clockwise: true
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'U',
                clockwise: false
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'B',
                clockwise: false
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'B',
                clockwise: true
            }]
        }
        if (point.y > 3.09) {
            return [{
                vector: new Vector3(0, 0, -10),
                direction: 'L',
                clockwise: true
            }, {
                vector: new Vector3(0, 0, 10),
                direction: 'L',
                clockwise: false
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'B',
                clockwise: false
            }, {
                vector: new Vector3(10, 0, 0),
                direction: 'B',
                clockwise: true
            }]
        }
    } else if (x === 0 && y === 2) {
        if (point.z > 3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'U',
                clockwise: true
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'U',
                clockwise: false
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'R',
                clockwise: false
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'R',
                clockwise: true
            }]
        }
        if (point.x > 3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'U',
                clockwise: false
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'U',
                clockwise: true
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'F',
                clockwise: false
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'F',
                clockwise: true
            }]
        }
        if (point.y > 3.09) {
            return [{
                vector: new Vector3(0, 0, -10),
                direction: 'R',
                clockwise: false
            }, {
                vector: new Vector3(0, 0, 10),
                direction: 'R',
                clockwise: true
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'F',
                clockwise: true
            }, {
                vector: new Vector3(10, 0, 0),
                direction: 'F',
                clockwise: false
            }]
        }
    } else if (x === 0 && y === 8) {
        if (point.z < -3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'U',
                clockwise: false
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'U',
                clockwise: true
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'R',
                clockwise: true
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'R',
                clockwise: false
            }]
        }
        if (point.x > 3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'U',
                clockwise: false
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'U',
                clockwise: true
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'B',
                clockwise: true
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'B',
                clockwise: false
            }]
        }
        if (point.y > 3.09) {
            return [{
                vector: new Vector3(0, 0, -10),
                direction: 'R',
                clockwise: false
            }, {
                vector: new Vector3(0, 0, 10),
                direction: 'R',
                clockwise: true
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'B',
                clockwise: false
            }, {
                vector: new Vector3(10, 0, 0),
                direction: 'B',
                clockwise: true
            }]
        }
    } else if (x === 2 && y === 0) {
        if (point.z > 3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'D',
                clockwise: false
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'D',
                clockwise: true
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'L',
                clockwise: true
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'L',
                clockwise: false
            }]
        }
        if (point.x < -3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'D',
                clockwise: false
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'D',
                clockwise: true
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'F',
                clockwise: true
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'F',
                clockwise: false
            }]
        }
        if (point.y < -3.09) {
            return [{
                vector: new Vector3(0, 0, -10),
                direction: 'L',
                clockwise: false
            }, {
                vector: new Vector3(0, 0, 10),
                direction: 'L',
                clockwise: true
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'F',
                clockwise: false
            }, {
                vector: new Vector3(10, 0, 0),
                direction: 'F',
                clockwise: true
            }]
        }
    } else if (x === 2 && y === 2) {
        if (point.z > 3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'D',
                clockwise: false
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'D',
                clockwise: true
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'R',
                clockwise: false
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'R',
                clockwise: true
            }]
        }
        if (point.x > 3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'D',
                clockwise: true
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'D',
                clockwise: false
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'F',
                clockwise: false
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'F',
                clockwise: true
            }]
        }
        if (point.y < -3.09) {
            return [{
                vector: new Vector3(0, 0, -10),
                direction: 'R',
                clockwise: true
            }, {
                vector: new Vector3(0, 0, 10),
                direction: 'R',
                clockwise: false
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'F',
                clockwise: false
            }, {
                vector: new Vector3(10, 0, 0),
                direction: 'F',
                clockwise: true
            }]
        }
    } else if (x === 2 && y === 6) {
        if (point.z < -3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'D',
                clockwise: true
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'D',
                clockwise: false
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'L',
                clockwise: false
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'L',
                clockwise: true
            }]
        }
        if (point.x < -3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'D',
                clockwise: false
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'D',
                clockwise: true
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'B',
                clockwise: false
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'B',
                clockwise: true
            }]
        }
        if (point.y < -3.09) {
            return [{
                vector: new Vector3(0, 0, -10),
                direction: 'R',
                clockwise: true
            }, {
                vector: new Vector3(0, 0, 10),
                direction: 'R',
                clockwise: false
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'F',
                clockwise: false
            }, {
                vector: new Vector3(10, 0, 0),
                direction: 'F',
                clockwise: true
            }]
        }
    } else if (x === 2 && y === 8) {
        if (point.z < -3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'D',
                clockwise: true
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'D',
                clockwise: false
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'R',
                clockwise: true
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'R',
                clockwise: false
            }]
        }
        if (point.x > 3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'D',
                clockwise: true
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'D',
                clockwise: false
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'B',
                clockwise: true
            }, {
                vector: new Vector3(0, 10, 0),
                direction: 'B',
                clockwise: false
            }]
        }
        if (point.y < -3.09) {
            return [{
                vector: new Vector3(0, 0, -10),
                direction: 'R',
                clockwise: true
            }, {
                vector: new Vector3(0, 0, 10),
                direction: 'R',
                clockwise: false
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'B',
                clockwise: false
            }, {
                vector: new Vector3(10, 0, 0),
                direction: 'B',
                clockwise: true
            }]
        }
    }
}

const getMiddleVectors = (x, y, point) => {
    if (x === 0 && y === 1) {
        if (point.z > 3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'U',
                clockwise: true
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'U',
                clockwise: false
            }]
        }
        if (point.y > 3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'F',
                clockwise: false
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'F',
                clockwise: true
            }]
        }
    } else if (x === 0 && y === 3) {
        if (point.x < -3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'U',
                clockwise: true
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'U',
                clockwise: false
            }]
        }
        if (point.y > 3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'L',
                clockwise: false
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'L',
                clockwise: true
            }]
        }
    } else if (x === 0 && y === 5) {
        if (point.x > 3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'U',
                clockwise: false
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'U',
                clockwise: true
            }]
        }
        if (point.y > 3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'R',
                clockwise: true
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'R',
                clockwise: false
            }]
        }
    }else if (x === 0 && y === 7) {
        if (point.z < - 3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'U',
                clockwise: false
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'U',
                clockwise: true
            }]
        }
        if (point.y > 3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'B',
                clockwise: true
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'B',
                clockwise: false
            }]
        }
    }else if (x === 1 && y === 0) {
        if (point.x < - 3.09) {
            return [{
                vector: new Vector3(0, 10, 0),
                direction: 'F',
                clockwise: false
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'F',
                clockwise: true
            }]
        }
        if (point.z > 3.09) {
            return [{
                vector: new Vector3(0, 10, 0),
                direction: 'L',
                clockwise: true
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'L',
                clockwise: false
            }]
        }
    }else if (x === 1 && y === 2) {
        if (point.x > 3.09) {
            return [{
                vector: new Vector3(0, 10, 0),
                direction: 'F',
                clockwise: true
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'F',
                clockwise: false
            }]
        }
        if (point.z > 3.09) {
            return [{
                vector: new Vector3(0, 10, 0),
                direction: 'R',
                clockwise: false
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'R',
                clockwise: true
            }]
        }
    }else if (x === 1 && y === 6) {
        if (point.x <- 3.09) {
            return [{
                vector: new Vector3(0, 10, 0),
                direction: 'B',
                clockwise: true
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'B',
                clockwise: false
            }]
        }
        if (point.z < -3.09) {
            return [{
                vector: new Vector3(0, 10, 0),
                direction: 'L',
                clockwise: false
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'L',
                clockwise: true
            }]
        }
    }else if (x === 1 && y === 8) {
        if (point.x > 3.09) {
            return [{
                vector: new Vector3(0, 10, 0),
                direction: 'B',
                clockwise: false
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'B',
                clockwise: true
            }]
        }
        if (point.z < -3.09) {
            return [{
                vector: new Vector3(0, 10, 0),
                direction: 'R',
                clockwise: true
            }, {
                vector: new Vector3(0, -10, 0),
                direction: 'R',
                clockwise: false
            }]
        }
    }else if (x === 2 && y === 1) {
        if (point.z> 3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'D',
                clockwise: false
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'D',
                clockwise: true
            }]
        }
        if (point.y < -3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'F',
                clockwise: true
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'F',
                clockwise: false
            }]
        }
    }else if (x === 2 && y ===3) {
        if (point.x < -3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'D',
                clockwise: false
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'D',
                clockwise: true
            }]
        }
        if (point.y < -3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'L',
                clockwise: true
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'L',
                clockwise: false
            }]
        }
    }else if (x === 2 && y ===5) {
        if (point.x >3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'D',
                clockwise: true
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'D',
                clockwise: false
            }]
        }
        if (point.y < -3.09) {
            return [{
                vector: new Vector3(0, 0, 10),
                direction: 'R',
                clockwise: false
            }, {
                vector: new Vector3(0, 0, -10),
                direction: 'R',
                clockwise: true
            }]
        }
    }else if (x === 2 && y ===7) {
        if (point.z < -3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'D',
                clockwise: true
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'D',
                clockwise: false
            }]
        }
        if (point.y < -3.09) {
            return [{
                vector: new Vector3(10, 0, 0),
                direction: 'B',
                clockwise: false
            }, {
                vector: new Vector3(-10, 0, 0),
                direction: 'B',
                clockwise: true
            }]
        }
    }
}

const isMiddle = (x, y) => {
    if (x === 0 && y === 1) {
        return true;
    } else if (x === 0 && y === 3) {
        return true;
    } else if (x === 0 && y === 5) {
        return true;
    } else if (x === 0 && y === 7) {
        return true;
    } else if (x === 2 && y === 1) {
        return true;
    } else if (x === 2 && y === 3) {
        return true;
    } else if (x === 2 && y === 5) {
        return true;
    } else if (x === 2 && y === 7) {
        return true;
    } else if (x === 1 && y === 0) {
        return true;
    } else if (x === 1 && y === 2) {
        return true;
    } else if (x === 1 && y === 6) {
        return true;
    } else return x === 1 && y === 8;
}

const isCorner = (x, y) => {
    if (x === 0 && y === 0) {
        return true;
    } else if (x === 0 && y === 6) {
        return true;
    } else if (x === 0 && y === 2) {
        return true;
    } else if (x === 0 && y === 8) {
        return true;
    } else if (x === 2 && y === 0) {
        return true;
    } else if (x === 2 && y === 2) {
        return true;
    } else if (x === 2 && y === 6) {
        return true
    } else return x === 2 && y === 8;
}

export const getVectors = (object) => {

    let x, y;

    console.log(object.point)
    for (let i = 0; i < 3; i++) {
        const index = cubeObjects[i].indexOf(object.object.parent);
        if (index !== -1) {
            x = i;
            y = index;
        }
    }

    if (isMiddle(x, y)) {
        return getMiddleVectors(x, y, object.point);
    } else if (isCorner(x, y)) {
        return getCornerVectors(x, y, object.point);
    } else {
        return [];
    }
}

export const moveAndSnap = (axis, clockwise) =>{
    rotateWall(axis, Math.PI / 2 , clockwise);
    snapRotation(axis,clockwise)
}
