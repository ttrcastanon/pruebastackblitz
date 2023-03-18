import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_Seguimiento_de_MaterialesComponent } from './list-Estatus_de_Seguimiento_de_Materiales.component';

describe('ListEstatus_de_Seguimiento_de_MaterialesComponent', () => {
  let component: ListEstatus_de_Seguimiento_de_MaterialesComponent;
  let fixture: ComponentFixture<ListEstatus_de_Seguimiento_de_MaterialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_Seguimiento_de_MaterialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_Seguimiento_de_MaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
