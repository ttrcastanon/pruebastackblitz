import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterSalida_en_almacenComponent } from './show-advance-filter-Salida_en_almacen.component';

describe('ShowAdvanceFilterSalida_en_almacenComponent', () => {
  let component: ShowAdvanceFilterSalida_en_almacenComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterSalida_en_almacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterSalida_en_almacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterSalida_en_almacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
