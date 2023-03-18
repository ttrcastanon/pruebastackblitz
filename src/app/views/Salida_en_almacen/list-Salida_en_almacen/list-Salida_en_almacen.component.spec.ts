import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSalida_en_almacenComponent } from './list-Salida_en_almacen.component';

describe('ListSalida_en_almacenComponent', () => {
  let component: ListSalida_en_almacenComponent;
  let fixture: ComponentFixture<ListSalida_en_almacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSalida_en_almacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSalida_en_almacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
