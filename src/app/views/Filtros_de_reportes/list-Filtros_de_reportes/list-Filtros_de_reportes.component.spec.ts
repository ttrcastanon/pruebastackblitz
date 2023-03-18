import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFiltros_de_reportesComponent } from './list-Filtros_de_reportes.component';

describe('ListFiltros_de_reportesComponent', () => {
  let component: ListFiltros_de_reportesComponent;
  let fixture: ComponentFixture<ListFiltros_de_reportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFiltros_de_reportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFiltros_de_reportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
