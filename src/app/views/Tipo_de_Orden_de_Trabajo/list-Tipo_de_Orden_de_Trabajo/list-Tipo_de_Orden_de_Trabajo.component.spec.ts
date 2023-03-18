import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Orden_de_TrabajoComponent } from './list-Tipo_de_Orden_de_Trabajo.component';

describe('ListTipo_de_Orden_de_TrabajoComponent', () => {
  let component: ListTipo_de_Orden_de_TrabajoComponent;
  let fixture: ComponentFixture<ListTipo_de_Orden_de_TrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Orden_de_TrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Orden_de_TrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
