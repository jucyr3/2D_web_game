import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-stat',
    imports: [],
    templateUrl: './stat.component.html',
    styleUrl: './stat.component.scss',
})
export class StatComponent {
    @Output() selected = new EventEmitter<boolean>();
    cahnge: boolean = false;
    clickItem(value: boolean) {
        this.cahnge = value;
        this.selected.emit(this.cahnge);
    }
}
