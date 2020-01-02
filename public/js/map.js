import getTileFor from './randomiser.js'

/**
 * Build a maxe-map
 */
let map01 = {
    0: {0:'tile-010',1:'tile-003',2:'tile-008',3:'tile-003',4:'tile-010',5:'tile-003'},
    1: {0:'tile-012',1:'tile-013',2:'tile-011',3:'tile-013',4:'tile-005',5:'tile-006'},
    2: {0:'tile-002',1:'tile-010',2:'tile-005',3:'tile-010',4:'tile-003',5:'tile-006'},
    3: {0:'tile-014',1:'tile-015',2:'tile-009',3:'tile-013',4:'tile-013',5:'tile-007'},
    4: {0:'tile-006',1:'tile-012',2:'tile-003',3:'tile-010',4:'tile-016',5:'tile-006'},
    5: {0:'tile-012',1:'tile-009',2:'tile-005',3:'tile-012',4:'tile-009',5:'tile-005'},
}

/**
 * generate a random map of given size
 */
function generateRandomMap(width = 6, height = 6) {

    let oddsFinish = (width * height);
    let pFinish = 1 / oddsFinish;
    let finishPlaced = false;

    let map = {},
        eastedge = false,
        southedge = false;

    for (let i = -1; i <= width; i++) {
        eastedge = ( i+1 == height ) ? true : false ;
        map[i] = {};

        for (let j = -1; j <= height; j++) {
            southedge = ( j+1 == height ) ? true : false ;
            pFinish = finishPlaced ? 0 : ( 1 / oddsFinish-- ) ;

            if (i == -1 || i == width || j == -1 || j == height) {
                map[i][j] = 'tile-000';
            } else  {
                let nexttile = getTileFor(map[i][j-1], map[i-1][j], eastedge, southedge, pFinish);
                map[i][j] = nexttile;
                if (nexttile == "tile-016") finishPlaced = true; //'tile-016' is the medal :)
            }
        }
    }

    return map;
}


let map = map01;
map = generateRandomMap();
export { map, generateRandomMap };