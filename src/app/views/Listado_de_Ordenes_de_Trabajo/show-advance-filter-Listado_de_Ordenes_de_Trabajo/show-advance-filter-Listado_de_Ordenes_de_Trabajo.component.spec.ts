import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterListado_de_Ordenes_de_TrabajoComponent } from './show-advance-filter-Listado_de_Ordenes_de_Trabajo.component';

describe('ShowAdvanceFilterListado_de_Ordenes_de_TrabajoComponent', () => {
  let component: ShowAdvanceFilterListado_de_Ordenes_de_TrabajoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterListado_de_Ordenes_de_TrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterListado_de_Ordenes_de_TrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterListado_de_Ordenes_de_TrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
