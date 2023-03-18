import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_CMP_a_CotizarComponent } from './list-Estatus_de_CMP_a_Cotizar.component';

describe('ListEstatus_de_CMP_a_CotizarComponent', () => {
  let component: ListEstatus_de_CMP_a_CotizarComponent;
  let fixture: ComponentFixture<ListEstatus_de_CMP_a_CotizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_CMP_a_CotizarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_CMP_a_CotizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
