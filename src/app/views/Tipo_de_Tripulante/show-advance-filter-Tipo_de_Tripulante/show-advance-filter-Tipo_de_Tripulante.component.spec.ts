import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_TripulanteComponent } from './show-advance-filter-Tipo_de_Tripulante.component';

describe('ShowAdvanceFilterTipo_de_TripulanteComponent', () => {
  let component: ShowAdvanceFilterTipo_de_TripulanteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_TripulanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_TripulanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_TripulanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
