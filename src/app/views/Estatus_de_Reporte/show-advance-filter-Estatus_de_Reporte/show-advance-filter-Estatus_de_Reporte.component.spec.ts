import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_ReporteComponent } from './show-advance-filter-Estatus_de_Reporte.component';

describe('ShowAdvanceFilterEstatus_de_ReporteComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_ReporteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_ReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_ReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_ReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
