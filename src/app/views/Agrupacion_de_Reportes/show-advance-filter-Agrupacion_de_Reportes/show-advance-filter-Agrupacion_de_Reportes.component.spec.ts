import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterAgrupacion_de_ReportesComponent } from './show-advance-filter-Agrupacion_de_Reportes.component';

describe('ShowAdvanceFilterAgrupacion_de_ReportesComponent', () => {
  let component: ShowAdvanceFilterAgrupacion_de_ReportesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterAgrupacion_de_ReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterAgrupacion_de_ReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterAgrupacion_de_ReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
