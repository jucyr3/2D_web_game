import { Component } from '@angular/core';

@Component({
    selector: 'app-waiting-room-page',
    imports: [],
    templateUrl: './waiting-room-page.component.html',
    styleUrl: './waiting-room-page.component.scss',
})
export class WaitingRoomPageComponent {
    accessCode: number = this.getRandomFourDigitNumber();

    getRandomFourDigitNumber(): number {
        return Math.floor(1000 + Math.random() * 9000);
    }
}
