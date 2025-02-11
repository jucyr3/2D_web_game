import { Injectable, signal } from '@angular/core';
import { IMAGES_PATH } from '@app/constants/imagePaths';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    imagesPath = IMAGES_PATH;

    private _itemSelected = signal<number>(1);
    private _diceChoicee: boolean = false;
    private _statChoice: boolean = false;
    private _name: string = '';

    setSelectedItem(value: number) {
        this._itemSelected.set(value);
    }
    getSelectedItem() {
        return this._itemSelected;
    }

    getdiceChoice() {
        return this._diceChoicee;
    }
    getstatChoice() {
        return this._statChoice;
    }

    showImageSelected() {
        return this.imagesPath[this._itemSelected() - 1].imagePath;
    }
    getName() {
        return this._name;
    }
    setDiceChoice(value: boolean) {
        this._diceChoicee = value;
    }
    setStatChoice(value: boolean) {
        this._statChoice = value;
    }
    setName(name: string) {
        this._name = name;
    }
}
