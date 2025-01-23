import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-name',
    imports: [],
    templateUrl: './name.component.html',
    styleUrl: './name.component.scss',
})
export class NameComponent {
    name: string = '';
    @ViewChild('nameInput') nameInput: ElementRef;
    changeName() {
        this.name = this.nameInput.nativeElement.value;
    }
}
