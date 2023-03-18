import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_cargaComponent } from './show-advance-filter-Tipo_de_carga.component';

describe('ShowAdvanceFilterTipo_de_cargaComponent', () => {
  let component: ShowAdvanceFilterTipo_de_cargaComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_cargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_cargaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_cargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
