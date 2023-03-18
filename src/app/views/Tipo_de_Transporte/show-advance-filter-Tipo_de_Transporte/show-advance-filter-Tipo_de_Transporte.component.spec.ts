import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_TransporteComponent } from './show-advance-filter-Tipo_de_Transporte.component';

describe('ShowAdvanceFilterTipo_de_TransporteComponent', () => {
  let component: ShowAdvanceFilterTipo_de_TransporteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_TransporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_TransporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_TransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
