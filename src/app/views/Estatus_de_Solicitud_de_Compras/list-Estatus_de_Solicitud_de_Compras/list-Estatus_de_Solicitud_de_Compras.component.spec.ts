import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_Solicitud_de_ComprasComponent } from './list-Estatus_de_Solicitud_de_Compras.component';

describe('ListEstatus_de_Solicitud_de_ComprasComponent', () => {
  let component: ListEstatus_de_Solicitud_de_ComprasComponent;
  let fixture: ComponentFixture<ListEstatus_de_Solicitud_de_ComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_Solicitud_de_ComprasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_Solicitud_de_ComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
