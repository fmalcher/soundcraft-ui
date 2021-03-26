import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumebusComponent } from './volumebus.component';

describe('VolumebusComponent', () => {
  let component: VolumebusComponent;
  let fixture: ComponentFixture<VolumebusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolumebusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumebusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
