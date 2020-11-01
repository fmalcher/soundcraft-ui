import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterChannelsComponent } from './master-channels.component';

describe('MasterChannelsComponent', () => {
  let component: MasterChannelsComponent;
  let fixture: ComponentFixture<MasterChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterChannelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
