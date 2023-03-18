import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClasificacion_de_proveedoresComponent } from './list-Clasificacion_de_proveedores.component';

describe('ListClasificacion_de_proveedoresComponent', () => {
  let component: ListClasificacion_de_proveedoresComponent;
  let fixture: ComponentFixture<ListClasificacion_de_proveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListClasificacion_de_proveedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClasificacion_de_proveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
