import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Map } from '@common/map';

@Component({
    selector: 'app-preview-container',
    imports: [CommonModule],
    templateUrl: './preview-container.component.html',
    styleUrl: './preview-container.component.scss',
})
export class PreviewContainerComponent {
    @Input() map!: Map;
    @Input() selectedMap!: Map | null;
    @Output() selectedMapChange = new EventEmitter<Map | null>();

    showDescription(map: Map): void {
        this.selectedMapChange.emit(map);
    }

    hideDescription(): void {
        this.selectedMapChange.emit(null);
    }
}
