import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_autorizacion_de_prefacturaComponent } from './show-advance-filter-Estatus_autorizacion_de_prefactura.component';

describe('ShowAdvanceFilterEstatus_autorizacion_de_prefacturaComponent', () => {
  let component: ShowAdvanceFilterEstatus_autorizacion_de_prefacturaComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_autorizacion_de_prefacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_autorizacion_de_prefacturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_autorizacion_de_prefacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
