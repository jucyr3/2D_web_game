export interface MapVerification {
    // true if passes
    isUniqueName: boolean;
    isNamePresent: boolean;
    isDescriptionPresent: boolean;
    isMapHalfFloor: boolean;
    isMapAccessible: boolean;
    areStartingPointsValid: boolean;
    areDoorsNextToWalls: boolean;
    areDoorsNotNextToBorder: boolean;
}
