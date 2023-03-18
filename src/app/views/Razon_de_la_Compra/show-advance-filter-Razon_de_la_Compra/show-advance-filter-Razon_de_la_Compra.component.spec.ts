import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterRazon_de_la_CompraComponent } from './show-advance-filter-Razon_de_la_Compra.component';

describe('ShowAdvanceFilterRazon_de_la_CompraComponent', () => {
  let component: ShowAdvanceFilterRazon_de_la_CompraComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterRazon_de_la_CompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterRazon_de_la_CompraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterRazon_de_la_CompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
