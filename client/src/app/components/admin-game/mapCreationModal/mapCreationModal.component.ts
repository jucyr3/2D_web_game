import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MapFormData } from '@app/interfaces/mapFormData';

@Component({
    selector: 'app-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './mapCreationModal.component.html',
    styleUrl: './mapCreationModal.component.scss',
    standalone: true,
})
export class MapCreationModalComponent {
    @Output() modalClose = new EventEmitter<void>();
    @Output() create = new EventEmitter<MapFormData>();

    newMapForm: MapFormData = {
        gameMode: 'Classic',
        size: 10,
    };

    closeModal() {
        this.modalClose.emit();
    }

    createMap() {
        this.create.emit(this.newMapForm);
    }
}
