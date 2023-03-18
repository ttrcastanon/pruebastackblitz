import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterFiltros_de_reportesComponent } from './show-advance-filter-Filtros_de_reportes.component';

describe('ShowAdvanceFilterFiltros_de_reportesComponent', () => {
  let component: ShowAdvanceFilterFiltros_de_reportesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterFiltros_de_reportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterFiltros_de_reportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterFiltros_de_reportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
