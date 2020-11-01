import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanComponent } from './pan.component';

describe('PanComponent', () => {
  let component: PanComponent;
  let fixture: ComponentFixture<PanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
