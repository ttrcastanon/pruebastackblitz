import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterPrioridad_del_ReporteComponent } from './show-advance-filter-Prioridad_del_Reporte.component';

describe('ShowAdvanceFilterPrioridad_del_ReporteComponent', () => {
  let component: ShowAdvanceFilterPrioridad_del_ReporteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterPrioridad_del_ReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterPrioridad_del_ReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterPrioridad_del_ReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
