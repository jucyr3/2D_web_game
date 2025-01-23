import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

export interface DialogData {
    title: string;
    content: string;
    cancelButtonLabel: string;
    confirmButtonLabel: string;
}

@Component({
    selector: 'app-pop-up',
    imports: [FormsModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
    templateUrl: './pop-up.component.html',
    styleUrl: './pop-up.component.scss',
})
export class PopUpComponent {
    @Input() title: string = 'Confirmer la sortie';
    @Input() content: string = "Quitter maintenant vous retirera de la liste d'attente";
    @Input() cancelButtonLabel: string = 'Annuler';
    @Input() confirmButtonLabel: string = 'Quitter';
    @Output() confirmed = new EventEmitter<boolean>();

    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.title = data.title || 'Confirmer la sortie';
        this.content = data.content || "Quitter maintenant vous retirera de la liste d'attente";
        this.cancelButtonLabel = data.cancelButtonLabel || 'Annuler';
        this.confirmButtonLabel = data.confirmButtonLabel || 'Quitter';
    }

    onConfirm(): void {
        this.confirmed.emit(true);
    }
}
