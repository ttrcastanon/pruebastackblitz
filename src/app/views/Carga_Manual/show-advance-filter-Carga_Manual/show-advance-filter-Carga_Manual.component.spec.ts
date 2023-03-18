import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCarga_ManualComponent } from './show-advance-filter-Carga_Manual.component';

describe('ShowAdvanceFilterCarga_ManualComponent', () => {
  let component: ShowAdvanceFilterCarga_ManualComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCarga_ManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCarga_ManualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCarga_ManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
