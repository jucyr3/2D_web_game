import { Component } from '@angular/core';
import { MapService } from '@app/services/edit-services/map.service';

@Component({
    selector: 'app-error-list',
    templateUrl: './error-list.component.html',
    styleUrl: './error-list.component.scss',
})
export class ErrorListComponent {
    errorDescriptions: { [key: string]: string } = {
        isUniqueName: 'Le nom de la carte est deja utilise',
        isNamePresent: 'Le nom de la carte est manquant',
        isDescriptionPresent: 'La carte doit contenir une description',
        isMapHalfFloor: 'La moite de la carte doit etre un plancher',
        isMapAccessible: 'La carte doit etre accessible',
        areStartingPointsValid: 'Les points de depart doivent etre valides',
        areItemsValid: 'le nombre d items est invalide',
        areDoorsNextToWalls: 'Les portes doivent etre a cote de deux murs',
        areDoorsNotNextToBorder: 'Les portes ne doivent pas etre a cote du bord de la carte',
        isNameValid: 'le nom de la carte est invalide',
        isDescriptionValid: 'la description est invalide',
        isFlagPresent: 'le drapeau n est pas present',
    };

    constructor(protected mapService: MapService) {}
}
