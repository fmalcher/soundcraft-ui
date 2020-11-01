import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixerButtonComponent } from './mixer-button.component';

describe('MixerButtonComponent', () => {
  let component: MixerButtonComponent;
  let fixture: ComponentFixture<MixerButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MixerButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MixerButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
