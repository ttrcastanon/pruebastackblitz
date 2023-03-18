import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLayout_Incidencia_VuelosComponent } from './list-Layout_Incidencia_Vuelos.component';

describe('ListLayout_Incidencia_VuelosComponent', () => {
  let component: ListLayout_Incidencia_VuelosComponent;
  let fixture: ComponentFixture<ListLayout_Incidencia_VuelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLayout_Incidencia_VuelosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLayout_Incidencia_VuelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
