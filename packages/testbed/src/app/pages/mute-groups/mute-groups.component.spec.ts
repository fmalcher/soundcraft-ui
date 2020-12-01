import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuteGroupsComponent } from './mute-groups.component';

describe('MuteGroupsComponent', () => {
  let component: MuteGroupsComponent;
  let fixture: ComponentFixture<MuteGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MuteGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MuteGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
