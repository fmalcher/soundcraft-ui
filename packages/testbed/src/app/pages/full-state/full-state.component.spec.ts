import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullStateComponent } from './full-state.component';

describe('FullStateComponent', () => {
  let component: FullStateComponent;
  let fixture: ComponentFixture<FullStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullStateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
