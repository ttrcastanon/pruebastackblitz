import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterIngreso_a_almacenComponent } from './show-advance-filter-Ingreso_a_almacen.component';

describe('ShowAdvanceFilterIngreso_a_almacenComponent', () => {
  let component: ShowAdvanceFilterIngreso_a_almacenComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterIngreso_a_almacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterIngreso_a_almacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterIngreso_a_almacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
