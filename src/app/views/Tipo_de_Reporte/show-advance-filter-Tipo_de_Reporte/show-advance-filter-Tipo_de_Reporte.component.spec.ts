import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_ReporteComponent } from './show-advance-filter-Tipo_de_Reporte.component';

describe('ShowAdvanceFilterTipo_de_ReporteComponent', () => {
  let component: ShowAdvanceFilterTipo_de_ReporteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_ReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_ReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_ReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
