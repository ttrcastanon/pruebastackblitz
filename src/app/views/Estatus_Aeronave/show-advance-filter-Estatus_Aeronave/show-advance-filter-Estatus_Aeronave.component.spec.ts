import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_AeronaveComponent } from './show-advance-filter-Estatus_Aeronave.component';

describe('ShowAdvanceFilterEstatus_AeronaveComponent', () => {
  let component: ShowAdvanceFilterEstatus_AeronaveComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
