import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileShowcaseComponent } from './profile-showcase.component';

describe('ProfileShowcaseComponent', () => {
  let component: ProfileShowcaseComponent;
  let fixture: ComponentFixture<ProfileShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileShowcaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
