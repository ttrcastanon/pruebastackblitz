import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_urgenciaComponent } from './show-advance-filter-Tipo_de_urgencia.component';

describe('ShowAdvanceFilterTipo_de_urgenciaComponent', () => {
  let component: ShowAdvanceFilterTipo_de_urgenciaComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_urgenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_urgenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_urgenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
