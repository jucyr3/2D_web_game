import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { PopUpComponent } from '@app/components/pop-up/pop-up.component';
import { WaitingRoomService } from '@app/services/waiting-room-service.service';

@Component({
    selector: 'app-waiting-room-page',
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
    templateUrl: './waiting-room-page.component.html',
    styleUrl: './waiting-room-page.component.scss',
})
export class WaitingRoomPageComponent implements OnInit {
    accessCode: number = 0;
    quitted: boolean = false;
    constructor(
        private waitingRoom: WaitingRoomService,
        readonly dialog: MatDialog,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.accessCode = this.waitingRoom.getRandomFourDigitNumber();
    }

    openQuitDialog(): void {
        const dialogRef = this.dialog.open(PopUpComponent, {
            width: '35%',
            data: {
                title: 'Confirmer la sortie',
                content: 'Quitter maintenant vous retirera de la liste. Êtes-vous sûr de vouloir quitter?',
                cancelButtonLabel: 'Non',
                confirmButtonLabel: 'Oui',
            },
        });
        dialogRef.componentInstance.confirmed.subscribe((result: boolean) => {
            if (result) {
                dialogRef.close();
                this.router.navigate(['/home']);
            } else {
                dialogRef.close();
            }
        });
    }
}
