import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapFormData } from '@common/mapForm';

@Component({
    selector: 'app-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss',
    standalone: true,
})
export class ModalComponent {
    @Output() modalClose = new EventEmitter<void>();
    @Output() create = new EventEmitter<MapFormData>();

    newMapForm: MapFormData = {
        mapName: '',
        mapMode: 'Classic',
        mapSize: 'PETITE',
    };

    closeModal() {
        this.modalClose.emit();
    }

    createMap() {
        this.create.emit(this.newMapForm);
    }
}
