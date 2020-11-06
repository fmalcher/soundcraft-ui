import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionComponent } from './transition.component';

describe('TransitionComponent', () => {
  let component: TransitionComponent;
  let fixture: ComponentFixture<TransitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
