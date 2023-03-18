import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterClasificacion_de_proveedoresComponent } from './show-advance-filter-Clasificacion_de_proveedores.component';

describe('ShowAdvanceFilterClasificacion_de_proveedoresComponent', () => {
  let component: ShowAdvanceFilterClasificacion_de_proveedoresComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterClasificacion_de_proveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterClasificacion_de_proveedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterClasificacion_de_proveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
