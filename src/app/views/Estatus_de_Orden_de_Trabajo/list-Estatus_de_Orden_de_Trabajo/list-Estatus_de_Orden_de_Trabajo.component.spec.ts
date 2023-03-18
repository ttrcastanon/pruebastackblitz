import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_Orden_de_TrabajoComponent } from './list-Estatus_de_Orden_de_Trabajo.component';

describe('ListEstatus_de_Orden_de_TrabajoComponent', () => {
  let component: ListEstatus_de_Orden_de_TrabajoComponent;
  let fixture: ComponentFixture<ListEstatus_de_Orden_de_TrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_Orden_de_TrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_Orden_de_TrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
