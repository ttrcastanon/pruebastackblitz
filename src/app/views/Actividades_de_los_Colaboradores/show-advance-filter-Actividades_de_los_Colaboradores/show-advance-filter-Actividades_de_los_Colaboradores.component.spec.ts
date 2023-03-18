import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterActividades_de_los_ColaboradoresComponent } from './show-advance-filter-Actividades_de_los_Colaboradores.component';

describe('ShowAdvanceFilterActividades_de_los_ColaboradoresComponent', () => {
  let component: ShowAdvanceFilterActividades_de_los_ColaboradoresComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterActividades_de_los_ColaboradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterActividades_de_los_ColaboradoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterActividades_de_los_ColaboradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
