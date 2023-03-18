import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_Orden_de_TrabajoComponent } from './show-advance-filter-Estatus_de_Orden_de_Trabajo.component';

describe('ShowAdvanceFilterEstatus_de_Orden_de_TrabajoComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_Orden_de_TrabajoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_Orden_de_TrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_Orden_de_TrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_Orden_de_TrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
