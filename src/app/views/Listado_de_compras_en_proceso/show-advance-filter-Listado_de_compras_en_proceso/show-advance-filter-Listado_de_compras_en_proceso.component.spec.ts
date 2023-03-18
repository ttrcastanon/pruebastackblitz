import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterListado_de_compras_en_procesoComponent } from './show-advance-filter-Listado_de_compras_en_proceso.component';

describe('ShowAdvanceFilterListado_de_compras_en_procesoComponent', () => {
  let component: ShowAdvanceFilterListado_de_compras_en_procesoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterListado_de_compras_en_procesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterListado_de_compras_en_procesoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterListado_de_compras_en_procesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
