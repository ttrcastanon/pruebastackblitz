import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_origen_del_reporteComponent } from './show-advance-filter-Tipo_de_origen_del_reporte.component';

describe('ShowAdvanceFilterTipo_de_origen_del_reporteComponent', () => {
  let component: ShowAdvanceFilterTipo_de_origen_del_reporteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_origen_del_reporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_origen_del_reporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_origen_del_reporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
