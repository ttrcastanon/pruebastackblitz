import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_HospedajeComponent } from './list-Tipo_de_Hospedaje.component';

describe('ListTipo_de_HospedajeComponent', () => {
  let component: ListTipo_de_HospedajeComponent;
  let fixture: ComponentFixture<ListTipo_de_HospedajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_HospedajeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_HospedajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
