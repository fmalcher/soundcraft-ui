import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxBusComponent } from './aux-bus.component';

describe('AuxBusComponent', () => {
  let component: AuxBusComponent;
  let fixture: ComponentFixture<AuxBusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuxBusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuxBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
