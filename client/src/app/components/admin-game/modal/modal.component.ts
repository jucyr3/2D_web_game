import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})

export class ModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<any>();

  newMapForm = {
    mapName: '',
    mapMode: 'CLASSIQUE' as 'CLASSIQUE' | 'CAPTURE_THE_FLAG',
    mapSize: 'PETIT' as 'PETIT' | 'MOYENNE' | 'GRANDE'
  };

  closeModal() {
    this.close.emit();
  }

  createMap() {
    this.create.emit(this.newMapForm);
  }
}
