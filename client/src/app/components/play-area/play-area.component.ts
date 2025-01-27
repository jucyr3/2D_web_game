import { Component, HostListener, inject } from '@angular/core';
import { SaveService } from '@app/services/save.service';
import { TimeService } from '@app/services/time.service';
import { Map } from '@common/map';

// TODO : Avoir un fichier séparé pour les constantes!
export const DEFAULT_WIDTH = 200;
export const DEFAULT_HEIGHT = 200;

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Component({
    selector: 'app-play-area',
    standalone: true,
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent {
    buttonPressed = '';
    private readonly timer = 5;
    // Injection de dépendance hors du constructeur
    // Équivalent à constructor(priate readonly timeService: TimeService)
    private readonly timeService: TimeService = inject(TimeService);
    constructor(private saveButton: SaveService) {}
    get time(): number {
        return this.timeService.time;
    }
    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }
    saveGame() {
        // temporary

        const tempMap = new Map('tempttitle', 10, true, ' ', 'Classic');

        this.saveButton.saveGame(tempMap);
    }

    // TODO : déplacer ceci dans un service de gestion de la souris!
    mouseHitDetect(event: MouseEvent) {
        if (event.button === MouseButton.Left) {
            this.timeService.startTimer(this.timer);
        }
    }
}
