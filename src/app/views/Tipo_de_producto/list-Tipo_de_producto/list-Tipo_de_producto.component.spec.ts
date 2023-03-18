import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_productoComponent } from './list-Tipo_de_producto.component';

describe('ListTipo_de_productoComponent', () => {
  let component: ListTipo_de_productoComponent;
  let fixture: ComponentFixture<ListTipo_de_productoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_productoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_productoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
