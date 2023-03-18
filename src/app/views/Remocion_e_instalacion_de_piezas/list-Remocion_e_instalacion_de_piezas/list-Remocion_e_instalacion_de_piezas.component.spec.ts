import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRemocion_e_instalacion_de_piezasComponent } from './list-Remocion_e_instalacion_de_piezas.component';

describe('ListRemocion_e_instalacion_de_piezasComponent', () => {
  let component: ListRemocion_e_instalacion_de_piezasComponent;
  let fixture: ComponentFixture<ListRemocion_e_instalacion_de_piezasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRemocion_e_instalacion_de_piezasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRemocion_e_instalacion_de_piezasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
