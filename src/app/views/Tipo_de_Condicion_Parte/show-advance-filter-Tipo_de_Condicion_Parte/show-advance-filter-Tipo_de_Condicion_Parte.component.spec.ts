import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Condicion_ParteComponent } from './show-advance-filter-Tipo_de_Condicion_Parte.component';

describe('ShowAdvanceFilterTipo_de_Condicion_ParteComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Condicion_ParteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Condicion_ParteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Condicion_ParteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Condicion_ParteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
