import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterRazon_de_Rechazo_a_AlmacenComponent } from './show-advance-filter-Razon_de_Rechazo_a_Almacen.component';

describe('ShowAdvanceFilterRazon_de_Rechazo_a_AlmacenComponent', () => {
  let component: ShowAdvanceFilterRazon_de_Rechazo_a_AlmacenComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterRazon_de_Rechazo_a_AlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterRazon_de_Rechazo_a_AlmacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterRazon_de_Rechazo_a_AlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
