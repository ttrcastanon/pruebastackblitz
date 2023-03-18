import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Servicios_AduanalesComponent } from './show-advance-filter-Tipo_de_Servicios_Aduanales.component';

describe('ShowAdvanceFilterTipo_de_Servicios_AduanalesComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Servicios_AduanalesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Servicios_AduanalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Servicios_AduanalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Servicios_AduanalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
