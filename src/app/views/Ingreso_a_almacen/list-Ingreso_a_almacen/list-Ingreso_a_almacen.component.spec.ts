import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIngreso_a_almacenComponent } from './list-Ingreso_a_almacen.component';

describe('ListIngreso_a_almacenComponent', () => {
  let component: ListIngreso_a_almacenComponent;
  let fixture: ComponentFixture<ListIngreso_a_almacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListIngreso_a_almacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIngreso_a_almacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
