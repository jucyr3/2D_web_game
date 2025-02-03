import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SaveService } from '@app/services/save.service';
import { Map } from '@common/map';

@Component({
    selector: 'app-save-button',
    imports: [],
    templateUrl: './save-button.component.html',
    styleUrl: './save-button.component.scss',
})
export class SaveButtonComponent {
    @Input() mapInstance: Map;
    @Output() saveButton: EventEmitter<void> = new EventEmitter<void>();
    constructor(private saveService: SaveService) {}

    saveMap() {
        const listErrors = this.saveService.validateGame(this.mapInstance);
        if (listErrors.length === 0) {
            this.saveService.validateGame(this.mapInstance);
            this.saveButton.emit(); // ?????
        } else {
            listErrors.forEach((error) => alert(error));
        }
    }
}
