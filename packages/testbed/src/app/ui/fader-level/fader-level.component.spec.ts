import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaderLevelComponent } from './fader-level.component';

describe('FaderLevelComponent', () => {
  let component: FaderLevelComponent;
  let fixture: ComponentFixture<FaderLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaderLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaderLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
