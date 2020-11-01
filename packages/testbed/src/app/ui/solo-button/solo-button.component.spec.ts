import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoloButtonComponent } from './solo-button.component';

describe('SoloButtonComponent', () => {
  let component: SoloButtonComponent;
  let fixture: ComponentFixture<SoloButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoloButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoloButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
