import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRazon_de_Rechazo_a_AlmacenComponent } from './list-Razon_de_Rechazo_a_Almacen.component';

describe('ListRazon_de_Rechazo_a_AlmacenComponent', () => {
  let component: ListRazon_de_Rechazo_a_AlmacenComponent;
  let fixture: ComponentFixture<ListRazon_de_Rechazo_a_AlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRazon_de_Rechazo_a_AlmacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRazon_de_Rechazo_a_AlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
