import { Component } from '@angular/core';
import { WaitingRoomServiceService } from '@app/services/waiting-room-service.service';

@Component({
    selector: 'app-waiting-room-page',
    imports: [],
    templateUrl: './waiting-room-page.component.html',
    styleUrl: './waiting-room-page.component.scss',
})
export class WaitingRoomPageComponent {
    constructor(private waitingRoom: WaitingRoomServiceService) {}
    accessCode: number = this.waitingRoom.getRandomFourDigitNumber();
}
