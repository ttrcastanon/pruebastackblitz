import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_SeguimientoComponent } from './list-Estatus_de_Seguimiento.component';

describe('ListEstatus_de_SeguimientoComponent', () => {
  let component: ListEstatus_de_SeguimientoComponent;
  let fixture: ComponentFixture<ListEstatus_de_SeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_SeguimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_SeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
