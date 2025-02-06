import { Component, EventEmitter, Output, Input } from '@angular/core';
import { MapService } from '@app/services/map.service';

export interface MapSettings {
    title: string;
    description: string;
}

@Component({
    selector: 'app-map-settings-modal',
    templateUrl: './map-settings-modal.component.html',
    styleUrls: ['./map-settings-modal.component.scss'],
})
export class MapSettingsModalComponent {
    @Input() mapTitle: string = ''; // Receive the title from parent
    @Input() description: string = ''; // Receive the description from parent
    @Output() closeModal = new EventEmitter<void>(); // Emit close event

    constructor(private mapService: MapService) {}

    saveSettings(newSettings: MapSettings) {
        this.mapService.map.name = newSettings.title; // Update map title
        this.mapService.map.description = newSettings.description; // Update map description
        this.close();
    }

    close() {
        this.closeModal.emit(); // Close modal without saving
    }
}
