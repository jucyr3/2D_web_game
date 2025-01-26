// stick-wars-menu.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stick-wars-menu',
  template: `
    <div class="menu-container">
      <div class="header">
        <h1>STICK-WARS RPG</h1>
      </div>

      <div class="icon-container">
        <img src="assets/sword-shield-icon.png" alt="Stick Wars Icon" class="game-icon">
      </div>

      <div class="buttons-container">
        <button class="menu-button" [routerLink]="['/join-game']">
          JOINDRE UNE PARTIE
        </button>
        
        <button class="menu-button" [routerLink]="['/create-game']">
          CRÉER UNE PARTIE
        </button>
        
        <button class="menu-button" [routerLink]="['/manage-games']">
          ADMINISTRER LES JEUX
        </button>
      </div>

      <div class="credits">
        <p>MADE BY:</p>
        <p class="names">NAME1, NAME2, NAME3, NAME4, NAME5, NAME6</p>
      </div>
    </div>
  `,
  styles: [`
    .menu-container {
      background-color: #2a2a2a;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }

    .header h1 {
      color: #e040fb;
      font-size: 2.5rem;
      font-weight: bold;
      text-align: center;
      margin: 2rem 0;
    }

    .icon-container {
      margin: 2rem 0;
    }

    .game-icon {
      width: 100px;
      height: 100px;
      background-color: #d4d4d4;
      border-radius: 50%;
      padding: 1rem;
    }

    .buttons-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      max-width: 300px;
    }

    .menu-button {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .menu-button:hover {
      background-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .menu-button:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .credits {
      margin-top: auto;
      text-align: center;
      color: white;
      font-size: 0.9rem;
    }

    .credits p {
      margin: 0.5rem 0;
    }

    .names {
      color: #e040fb;
    }

    @media (max-width: 768px) {
      .header h1 {
        font-size: 2rem;
      }

      .game-icon {
        width: 80px;
        height: 80px;
      }

      .buttons-container {
        max-width: 280px;
      }
    }
  `],
  imports: [RouterLink],
  standalone: true
})
export class TestComponent {
  constructor(private router: Router) {}

  async joinGame() {
    try {
      await this.router.navigate(['/join-game']);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }

  async createGame() {
    try {
      await this.router.navigate(['/create-game']);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }

  async manageGames() {
    try {
      await this.router.navigate(['/manage-games']);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }
}