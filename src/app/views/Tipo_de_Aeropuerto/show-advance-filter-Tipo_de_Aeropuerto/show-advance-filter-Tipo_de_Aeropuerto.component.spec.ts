import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_AeropuertoComponent } from './show-advance-filter-Tipo_de_Aeropuerto.component';

describe('ShowAdvanceFilterTipo_de_AeropuertoComponent', () => {
  let component: ShowAdvanceFilterTipo_de_AeropuertoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_AeropuertoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_AeropuertoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_AeropuertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
