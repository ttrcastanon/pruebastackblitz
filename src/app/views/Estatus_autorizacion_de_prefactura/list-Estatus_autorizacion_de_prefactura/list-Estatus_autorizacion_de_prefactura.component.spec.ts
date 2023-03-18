import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_autorizacion_de_prefacturaComponent } from './list-Estatus_autorizacion_de_prefactura.component';

describe('ListEstatus_autorizacion_de_prefacturaComponent', () => {
  let component: ListEstatus_autorizacion_de_prefacturaComponent;
  let fixture: ComponentFixture<ListEstatus_autorizacion_de_prefacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_autorizacion_de_prefacturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_autorizacion_de_prefacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
