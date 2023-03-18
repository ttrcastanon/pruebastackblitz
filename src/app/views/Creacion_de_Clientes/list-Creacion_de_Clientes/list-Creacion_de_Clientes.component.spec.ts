import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCreacion_de_ClientesComponent } from './list-Creacion_de_Clientes.component';

describe('ListCreacion_de_ClientesComponent', () => {
  let component: ListCreacion_de_ClientesComponent;
  let fixture: ComponentFixture<ListCreacion_de_ClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCreacion_de_ClientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCreacion_de_ClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
