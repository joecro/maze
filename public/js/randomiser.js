import { canIMove } from './maze.js';

let tilesArray = [
    'tile-001',
    'tile-002',
    'tile-003',
    'tile-004',
    'tile-005',
    'tile-006',
    'tile-007',
    'tile-008',
    'tile-009',
    'tile-010',
    'tile-011',
    'tile-012',
    'tile-013',
    'tile-014',
    'tile-015',
    'tile-016'
];

let eastEdgeTilesArray = [
    'tile-001',
    'tile-004',
    'tile-005',
    'tile-008',
    'tile-009',
    'tile-012',
    'tile-013',
    'tile-016'
];

let southEdgeTilesArray = [
    'tile-001',
    'tile-002',
    'tile-003',
    'tile-004',
    'tile-005',
    'tile-006',
    'tile-007',
    'tile-016'
];


let southEastCornerTilesArray = [
    'tile-000',
    'tile-001',
    'tile-004',
    'tile-005'
];


let transitions = tilesArray;

let maxDeadends = 5;
let medalPlaced = false;


let densities = {
    'tile-000': 0.01,
    'tile-001': 0.02,
    'tile-002': 0.02,
    'tile-003': 0.115,
    'tile-004': 0.02,
    'tile-005': 0.115,
    'tile-006': 0.105,
    'tile-007': 0.0525,
    'tile-008': 0.02,
    'tile-009': 0.105,
    'tile-010': 0.115,
    'tile-011': 0.0525,
    'tile-012': 0.115,
    'tile-013': 0.0525,
    'tile-014': 0.0525,
    'tile-015': 0.03,
    'tile-016': 0.01
};



/**
 * Quadrant 0 is no paths entering from north or west
 */
let q0densities = {
    'tile-016': 0,
    'tile-000': 0.01,
    'tile-001': 0,
    'tile-002': 0.12,
    'tile-003': 0,
    'tile-004': 0,
    'tile-005': 0,
    'tile-006': 0,
    'tile-007': 0,
    'tile-008': 0.24,
    'tile-009': 0,
    'tile-010': 1.0,
    'tile-011': 0,
    'tile-012': 0,
    'tile-013': 0,
    'tile-014': 0,
    'tile-015': 0
};


/**
 * quadrant 1 is a path entering from north but NOT west
 */
let q1densities = {
    'tile-016': 0,
    'tile-000': 0,
    'tile-001': 0.05,
    'tile-002': 0,
    'tile-003': 0.42,
    'tile-004': 0,
    'tile-005': 0,
    'tile-006': 0,
    'tile-007': 0,
    'tile-008': 0,
    'tile-009': 0.75,
    'tile-010': 0,
    'tile-011': 1.0,
    'tile-012': 0,
    'tile-013': 0,
    'tile-014': 0,
    'tile-015': 0
};

/**
 * quadrant 2 is a path entering from west but NOT north
 */
let q2densities = {
    'tile-016': 0,
    'tile-000': 0,
    'tile-001': 0,
    'tile-002': 0,
    'tile-003': 0,
    'tile-004': 0.05,
    'tile-005': 0,
    'tile-006': 0.38,
    'tile-007': 0,
    'tile-008': 0,
    'tile-009': 0,
    'tile-010': 0,
    'tile-011': 0,
    'tile-012': 0.75,
    'tile-013': 0,
    'tile-014': 1.0,
    'tile-015': 0
};

/**
 * quadrant 3 is a path entering from both north AND west
 */
let q3densities = {
    'tile-016': 0,
    'tile-000': 0,
    'tile-001': 0,
    'tile-002': 0,
    'tile-003': 0,
    'tile-004': 0,
    'tile-005': 0.4,
    'tile-006': 0,
    'tile-007': 0.6,
    'tile-008': 0,
    'tile-009': 0,
    'tile-010': 0,
    'tile-011': 0,
    'tile-012': 0,
    'tile-013': 0.8,
    'tile-014': 0,
    'tile-015': 1.0,
};


/**
 * Pick a tile from a density array, based on a Math.random() number
 * @param {*} densityArray 
 */
function getTileFrom(densityArray, eastedge, southedge) {
    let debug = false;
    let result = "noresult";
    let dart = 0;
    let targetArray = tilesArray;
    let seCorner = eastedge && southedge;

    if (seCorner) {
        targetArray = southEastCornerTilesArray;
    } else if (eastedge && !southedge) {
        targetArray = eastEdgeTilesArray;
    } else if (southedge && !eastedge) {
        targetArray = southEdgeTilesArray;
    }

    while (result == "noresult") {
        dart = seCorner? 0.001 : Math.random();

        if (debug) console.log("Dart was " + dart);
        
        targetArray.forEach(tileID => {

            if (dart < densityArray[tileID]) {
                result = tileID;
                dart = 2.0; // remove dart from board
                if (debug) console.log("dart was less than " + densityArray[tileID]);
            }
        });
    }

    return result;
}

function getTileFor(northtile, westtile, eastedge = false, southedge = false) {
    if (!canIMove('south',northtile) && !canIMove('east',westtile)) {
        return getTileFrom(q0densities, eastedge, southedge);
    }
    
    if (canIMove('south',northtile) && !canIMove('east',westtile)) {
        return getTileFrom(q1densities, eastedge, southedge);
    }
    
    if (!canIMove('south',northtile) && canIMove('east',westtile)) {
        return getTileFrom(q2densities, eastedge, southedge);
    }
    
    if (canIMove('south',northtile) && canIMove('east',westtile)) {
        return getTileFrom(q3densities, eastedge, southedge);
    }
}

export default getTileFor;