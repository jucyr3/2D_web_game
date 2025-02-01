import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesGridComponent } from './games-grid.component';

describe('GamesGridComponent', () => {
  let component: GamesGridComponent;
  let fixture: ComponentFixture<GamesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
