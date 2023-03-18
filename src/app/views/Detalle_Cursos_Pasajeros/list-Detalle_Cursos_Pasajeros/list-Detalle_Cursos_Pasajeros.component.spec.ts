import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetalle_Cursos_PasajerosComponent } from './list-Detalle_Cursos_Pasajeros.component';

describe('ListDetalle_Cursos_PasajerosComponent', () => {
  let component: ListDetalle_Cursos_PasajerosComponent;
  let fixture: ComponentFixture<ListDetalle_Cursos_PasajerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDetalle_Cursos_PasajerosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDetalle_Cursos_PasajerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
