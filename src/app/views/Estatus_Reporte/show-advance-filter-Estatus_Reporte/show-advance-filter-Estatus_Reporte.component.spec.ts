import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_ReporteComponent } from './show-advance-filter-Estatus_Reporte.component';

describe('ShowAdvanceFilterEstatus_ReporteComponent', () => {
  let component: ShowAdvanceFilterEstatus_ReporteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_ReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_ReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_ReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
