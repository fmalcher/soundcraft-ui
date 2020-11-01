import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxBusComponent } from './fx-bus.component';

describe('FxBusComponent', () => {
  let component: FxBusComponent;
  let fixture: ComponentFixture<FxBusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxBusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
