import { Component } from '@angular/core';

@Component({
    selector: 'app-stat',
    imports: [],
    templateUrl: './stat.component.html',
    styleUrl: './stat.component.scss',
})
export class StatComponent {
    cahnge: boolean = false;
    clickItem(value: boolean, element: any) {
        this.cahnge = value;
    }
}
