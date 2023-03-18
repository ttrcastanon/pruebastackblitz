import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_TripulacionComponent } from './show-advance-filter-Estatus_Tripulacion.component';

describe('ShowAdvanceFilterEstatus_TripulacionComponent', () => {
  let component: ShowAdvanceFilterEstatus_TripulacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_TripulacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_TripulacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_TripulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
