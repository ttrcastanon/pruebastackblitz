import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_HospedajeComponent } from './show-advance-filter-Tipo_de_Hospedaje.component';

describe('ShowAdvanceFilterTipo_de_HospedajeComponent', () => {
  let component: ShowAdvanceFilterTipo_de_HospedajeComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_HospedajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_HospedajeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_HospedajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
