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
    'tile-015'
];

let eastEdgeTilesArray = [
    'tile-001',
    'tile-004',
    'tile-005',
    'tile-008',
    'tile-009',
    'tile-012',
    'tile-013'
];

let southEdgeTilesArray = [
    'tile-001',
    'tile-002',
    'tile-003',
    'tile-004',
    'tile-005',
    'tile-006',
    'tile-007'
];


let southEastCornerTilesArray = [
    'tile-000',
    'tile-001',
    'tile-004',
    'tile-005'
];


let medalPlaced = false;
function resetMedal() {
    medalPlaced = false;
}

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
    'tile-015': 0.03
};



/**
 * Quadrant 0 is no paths entering from north or west
 */
let q0densities = {
    'tile-000': 0.01,
    'tile-002': 0.12,
    'tile-008': 0.24,
    'tile-010': 1.0
};
let q0Sdensities = {
    'tile-000': 0.08125,
    'tile-002': 1.0
};
let q0Edensities = {
    'tile-000': 0.05,
    'tile-008': 1.0
};


/**
 * quadrant 1 is a path entering from north but NOT west
 */
let q1densities = {
    'tile-001': 0.05,
    'tile-003': 0.42,
    'tile-009': 0.75,
    'tile-011': 1.0
};
let q1Sdensities = {
    'tile-001': 0.13,
    'tile-003': 1.0
};
let q1Edensities = {
    'tile-001': 0.07,
    'tile-009': 1.0
};

/**
 * quadrant 2 is a path entering from west but NOT north
 */
let q2densities = {
    'tile-004': 0.05,
    'tile-006': 0.38,
    'tile-012': 0.75,
    'tile-014': 1.0
};
let q2Sdensities = {
    'tile-004': 0.14,
    'tile-006': 1.0
};
let q2Edensities = {
    'tile-004': 0.07,
    'tile-012': 1.0
};

/**
 * quadrant 3 is a path entering from both north AND west
 */
let q3densities = {
    'tile-005': 0.4,
    'tile-007': 0.6,
    'tile-013': 0.8,
    'tile-015': 1.0,
};
let q3Sdensities = {
    'tile-005': 0.66,
    'tile-007': 1.0
};
let q3Edensities = {
    'tile-005': 0.33,
    'tile-013': 1.0
};


/**
 * Pick a tile from a density array, based on a Math.random() number
 * @param {*} densityArray 
 */
function getTileFrom(densityArray, eastedge, southedge, remainingTiles = 20) {
    let debug = false,
        result = "noresult",
        dart = 0,
        pMedal = 1/remainingTiles,
        targetArray = tilesArray,
        seCorner = eastedge && southedge;

    if (seCorner) {
        targetArray = southEastCornerTilesArray;
    } else if (eastedge && !southedge) {
        targetArray = eastEdgeTilesArray;
    } else if (southedge && !eastedge) {
        targetArray = southEdgeTilesArray;
    }

    // if we're down to the bottom-right corner, make sure we find a non-empty tile
    dart = seCorner? 0.001 : Math.random();
    if (debug) {
        console.log("Dart was " + dart);
    }
    
    if (!medalPlaced && dart < pMedal) {
        result = "tile-016";
        medalPlaced = true;
    } else {
        result = targetArray
            .find(tileID => (dart < densityArray[tileID]));
    }
    if (debug) console.log("dart was less than " + densityArray[result]);

    return result;
}

function getTileFor(northtile, westtile, eastedge = false, southedge = false, tilesRemaining = 20) {
    let selectedDensities = densities;
    if (!canIMove('south',northtile) && !canIMove('east',westtile)) {
        selectedDensities = eastedge? q0Edensities: southedge? q0Sdensities : q0densities;
    }
    
    if (canIMove('south',northtile) && !canIMove('east',westtile)) {
        selectedDensities = eastedge? q1Edensities: southedge? q1Sdensities : q1densities;
    }
    
    if (!canIMove('south',northtile) && canIMove('east',westtile)) {
        selectedDensities = eastedge? q2Edensities: southedge? q2Sdensities : q2densities;
    }
    
    if (canIMove('south',northtile) && canIMove('east',westtile)) {
        selectedDensities = eastedge? q3Edensities: southedge? q3Sdensities : q3densities;
    }
    
    return getTileFrom(selectedDensities, eastedge, southedge, tilesRemaining);
}

export {getTileFor,resetMedal};