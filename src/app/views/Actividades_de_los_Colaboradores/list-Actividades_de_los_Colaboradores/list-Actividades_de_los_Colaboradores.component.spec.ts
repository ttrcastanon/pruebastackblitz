import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListActividades_de_los_ColaboradoresComponent } from './list-Actividades_de_los_Colaboradores.component';

describe('ListActividades_de_los_ColaboradoresComponent', () => {
  let component: ListActividades_de_los_ColaboradoresComponent;
  let fixture: ComponentFixture<ListActividades_de_los_ColaboradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListActividades_de_los_ColaboradoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListActividades_de_los_ColaboradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
