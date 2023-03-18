import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEquipo_de_NavegacionComponent } from './list-Equipo_de_Navegacion.component';

describe('ListEquipo_de_NavegacionComponent', () => {
  let component: ListEquipo_de_NavegacionComponent;
  let fixture: ComponentFixture<ListEquipo_de_NavegacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEquipo_de_NavegacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEquipo_de_NavegacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
