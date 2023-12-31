import { getTileFor, resetMedal } from './randomiser.js'

/**
 * Build a maxe-map
 */
let map01 = {    
    0: {0:'tile-010',1:'tile-012',2:'tile-002',3:'tile-014',4:'tile-006',5:'tile-012'},
    1: {0:'tile-003',1:'tile-013',2:'tile-010',3:'tile-015',4:'tile-012',5:'tile-009'},
    2: {0:'tile-008',1:'tile-011',2:'tile-005',3:'tile-009',4:'tile-003',5:'tile-005'},
    3: {0:'tile-003',1:'tile-013',2:'tile-010',3:'tile-013',4:'tile-010',5:'tile-012'},
    4: {0:'tile-010',1:'tile-005',2:'tile-003',3:'tile-013',4:'tile-016',5:'tile-009'},
    5: {0:'tile-003',1:'tile-006',2:'tile-006',3:'tile-007',4:'tile-006',5:'tile-005'},
}

/**
 * generate a random map of given size
 */
function generateRandomMap(width = 6, height = 6) {

    resetMedal();

    let map = {},
        eastedge = false,
        southedge = false,
        nTiles = (width - 1) * (height - 1);

    for (let j = -1; j <= height; j++) {
        southedge = ( j+1 == height ) ? true : false ;
        map[j] = {};
            
        for (let i = -1; i <= width; i++) {
            eastedge = ( i+1 == width ) ? true : false ;

            if (i == -1 || j == -1 || i == width || j == height ) {
                map[j][i] = 'tile-000'; // these will never display on screen, but they are considered by the algorithm in getTileFor()
            } else  {                
                let nexttile = getTileFor(map[j-1][i], map[j][i-1], eastedge, southedge, nTiles--);
                map[j][i] = nexttile;
            }
        }
    }

    return map;
}


let map = map01;
//map = generateRandomMap();
export { map, generateRandomMap };