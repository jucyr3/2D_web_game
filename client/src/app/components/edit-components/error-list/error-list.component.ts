import { Component } from '@angular/core';
import { MapService } from '@app/services/edit-services/map.service';

@Component({
    selector: 'app-error-list',
    templateUrl: './error-list.component.html',
    styleUrl: './error-list.component.scss',
})
export class ErrorListComponent {
    errorDescriptions: { [key: string]: string } = {
        isUniqueName: 'Le nom de la carte est déjà utilisé',
        isNamePresent: 'Le nom de la carte est manquant',
        isDescriptionPresent: 'La carte doit contenir une description',
        isMapHalfFloor: 'La moitié de la carte doit être un plancher',
        isMapAccessible: 'La carte doit être accessible',
        areStartingPointsValid: 'Les points de départ doivent être valides',
        areItemsValid: "Le nombre maximum d'objets doit etre place",
        areDoorsNextToWalls: 'Les portes doivent être à côté de deux murs',
        areDoorsNotNextToBorder: 'Les portes ne doivent pas être à côté du bord de la carte',
        isNameValid: 'Le nom de la carte doit être valide',
        isDescriptionValid: 'La description de la carte doit être valide',
        isFlagPresent: 'Le drapeau doit être présent',
    };

    constructor(protected mapService: MapService) {}
}
