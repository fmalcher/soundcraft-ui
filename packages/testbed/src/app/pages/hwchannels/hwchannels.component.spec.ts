import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HwchannelsComponent } from './hwchannels.component';

describe('HwchannelsComponent', () => {
  let component: HwchannelsComponent;
  let fixture: ComponentFixture<HwchannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HwchannelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HwchannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
