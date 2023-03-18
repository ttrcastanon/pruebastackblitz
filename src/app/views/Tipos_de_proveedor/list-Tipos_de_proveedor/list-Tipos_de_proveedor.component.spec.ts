import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipos_de_proveedorComponent } from './list-Tipos_de_proveedor.component';

describe('ListTipos_de_proveedorComponent', () => {
  let component: ListTipos_de_proveedorComponent;
  let fixture: ComponentFixture<ListTipos_de_proveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipos_de_proveedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipos_de_proveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
