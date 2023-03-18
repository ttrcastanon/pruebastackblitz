import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_Solicitud_de_Compras_GeneralesComponent } from './list-Estatus_de_Solicitud_de_Compras_Generales.component';

describe('ListEstatus_de_Solicitud_de_Compras_GeneralesComponent', () => {
  let component: ListEstatus_de_Solicitud_de_Compras_GeneralesComponent;
  let fixture: ComponentFixture<ListEstatus_de_Solicitud_de_Compras_GeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_Solicitud_de_Compras_GeneralesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_Solicitud_de_Compras_GeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
