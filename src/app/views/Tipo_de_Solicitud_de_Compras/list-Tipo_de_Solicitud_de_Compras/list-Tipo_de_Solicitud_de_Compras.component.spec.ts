import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Solicitud_de_ComprasComponent } from './list-Tipo_de_Solicitud_de_Compras.component';

describe('ListTipo_de_Solicitud_de_ComprasComponent', () => {
  let component: ListTipo_de_Solicitud_de_ComprasComponent;
  let fixture: ComponentFixture<ListTipo_de_Solicitud_de_ComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Solicitud_de_ComprasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Solicitud_de_ComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
