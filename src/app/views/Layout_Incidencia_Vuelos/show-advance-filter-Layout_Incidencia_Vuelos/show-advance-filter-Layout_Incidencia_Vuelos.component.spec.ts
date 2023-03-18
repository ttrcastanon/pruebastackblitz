import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterLayout_Incidencia_VuelosComponent } from './show-advance-filter-Layout_Incidencia_Vuelos.component';

describe('ShowAdvanceFilterLayout_Incidencia_VuelosComponent', () => {
  let component: ShowAdvanceFilterLayout_Incidencia_VuelosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterLayout_Incidencia_VuelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterLayout_Incidencia_VuelosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterLayout_Incidencia_VuelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
