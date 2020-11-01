import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuteButtonComponent } from './mute-button.component';

describe('MuteButtonComponent', () => {
  let component: MuteButtonComponent;
  let fixture: ComponentFixture<MuteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MuteButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MuteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
