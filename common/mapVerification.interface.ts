export interface MapVerification {
    // true if passes
    isUniqueName: boolean;
    isNamePresent: boolean;
    isDescriptionPresent: boolean;
    isMapHalfFloor: boolean;
    isMapAccessible: boolean;
    areStartingPointsValid: boolean;
    // areItemsValid: boolean;
    areDoorsNextToWalls: boolean;
    areDoorsNotNextToBorder: boolean;
    isNameValid: boolean;
    isDescriptionValid: boolean;
}