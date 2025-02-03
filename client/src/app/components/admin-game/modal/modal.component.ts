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
    mapMode: 'Classic' as 'Classic' | 'CTF',
    mapSize: 'PETITE' as 'PETITE' | 'MOYENNE' | 'GRANDE'
  };

  closeModal() {
    this.close.emit();
  }

  createMap() {
    this.create.emit(this.newMapForm);
  }
}
