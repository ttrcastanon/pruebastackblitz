import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterMedio_de_ComunicacionComponent } from './show-advance-filter-Medio_de_Comunicacion.component';

describe('ShowAdvanceFilterMedio_de_ComunicacionComponent', () => {
  let component: ShowAdvanceFilterMedio_de_ComunicacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterMedio_de_ComunicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterMedio_de_ComunicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterMedio_de_ComunicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
