import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesCardComponent } from './games-card.component';

describe('GamesCardComponent', () => {
  let component: GamesCardComponent;
  let fixture: ComponentFixture<GamesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
