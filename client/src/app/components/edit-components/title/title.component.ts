import { Component } from '@angular/core';
import { MapService } from '@app/services/map.service';

@Component({
    selector: 'app-title',
    templateUrl: './title.component.html',
    styleUrl: './title.component.scss',
})
export class TitleComponent {
    title = this.mapService.map.name;

    constructor(protected mapService: MapService) {}

    onTitleInput(event: Event) {
        this.title = (event.target as HTMLInputElement).value;
    }

    onBlur() {
        this.updateValue();
    }

    updateValue() {
        if (!this.title || this.title.trim() === '') {
            this.title = 'Untitled';
        }
        this.mapService.map.name = this.title;
    }
}
