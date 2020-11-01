import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepostComponent } from './prepost.component';

describe('PrepostComponent', () => {
  let component: PrepostComponent;
  let fixture: ComponentFixture<PrepostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
