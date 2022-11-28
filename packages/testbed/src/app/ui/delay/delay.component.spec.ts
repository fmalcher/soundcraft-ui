import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayComponent } from './delay.component';

describe('DelayComponent', () => {
  let component: DelayComponent;
  let fixture: ComponentFixture<DelayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DelayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
