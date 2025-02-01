import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameActionsComponent } from './game-actions.component';

describe('GameActionsComponent', () => {
  let component: GameActionsComponent;
  let fixture: ComponentFixture<GameActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
