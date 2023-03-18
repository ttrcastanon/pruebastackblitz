import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_CalibracionComponent } from './show-advance-filter-Estatus_de_Calibracion.component';

describe('ShowAdvanceFilterEstatus_de_CalibracionComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_CalibracionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_CalibracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_CalibracionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_CalibracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
