import { provideHttpClient } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Routes, provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { environment } from './environments/environment';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { TestComponent } from '@app/pages/test/test.component';
import { CreateCharacterPageComponent } from '@app/pages/create-character-page/create-character-page.component';
import { CreateMatchPageComponent } from '@app/pages/create-match-page/create-match-page.component';
import { WaitingRoomPageComponent } from '@app/pages/waiting-room-page/waiting-room-page.component';

if (environment.production) {
    enableProdMode();
}

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'admin', component: AdminPageComponent },
    { path: 'material', component: MaterialPageComponent },
    { path: 'test', component: TestComponent },
    { path: 'character', component: CreateCharacterPageComponent },
    { path: 'match', component: CreateMatchPageComponent },
    { path: 'waitingRoom', component: WaitingRoomPageComponent },
    { path: '**', redirectTo: '/home' },
];

bootstrapApplication(AppComponent, {
    providers: [provideHttpClient(), provideRouter(routes, withHashLocation()), provideAnimations()],
});
