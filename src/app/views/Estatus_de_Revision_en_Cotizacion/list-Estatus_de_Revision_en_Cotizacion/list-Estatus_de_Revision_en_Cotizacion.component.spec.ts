import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_Revision_en_CotizacionComponent } from './list-Estatus_de_Revision_en_Cotizacion.component';

describe('ListEstatus_de_Revision_en_CotizacionComponent', () => {
  let component: ListEstatus_de_Revision_en_CotizacionComponent;
  let fixture: ComponentFixture<ListEstatus_de_Revision_en_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_Revision_en_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_Revision_en_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
