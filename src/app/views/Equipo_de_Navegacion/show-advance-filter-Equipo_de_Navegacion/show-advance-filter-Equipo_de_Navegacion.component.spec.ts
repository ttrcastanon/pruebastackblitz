import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEquipo_de_NavegacionComponent } from './show-advance-filter-Equipo_de_Navegacion.component';

describe('ShowAdvanceFilterEquipo_de_NavegacionComponent', () => {
  let component: ShowAdvanceFilterEquipo_de_NavegacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEquipo_de_NavegacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEquipo_de_NavegacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEquipo_de_NavegacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
