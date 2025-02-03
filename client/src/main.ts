import { provideHttpClient } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Routes, provideRouter, withHashLocation } from '@angular/router';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { AppComponent } from '@app/pages/app/app.component';
import { CreateCharacterPageComponent } from '@app/pages/create-character-page/create-character-page.component';
import { CreateMatchPageComponent } from '@app/pages/create-match-page/create-match-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { TestComponent } from '@app/pages/test/test.component';
import { WaitingRoomPageComponent } from '@app/pages/waiting-room-page/waiting-room-page.component';
import { environment } from './environments/environment';
import { EditPageComponent } from '@app/pages/edit-page/edit-page.component';
import { provideTippyLoader, provideTippyConfig, tooltipVariation, popperVariation } from '@ngneat/helipopper/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

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
    { path: 'edit', component: EditPageComponent},
    { path: 'edit/:id', component: EditPageComponent}
];

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        provideRouter(routes, withHashLocation()),
        provideAnimations(),
        provideTippyLoader(() => import('tippy.js')),
        provideTippyConfig({
            defaultVariation: 'tooltip',
            variations: {
                tooltip: tooltipVariation,
                popper: popperVariation,
            },
        }), provideAnimationsAsync(), provideAnimationsAsync(),
    ],
});
