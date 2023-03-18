import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Orden_de_TrabajoComponent } from './show-advance-filter-Tipo_de_Orden_de_Trabajo.component';

describe('ShowAdvanceFilterTipo_de_Orden_de_TrabajoComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Orden_de_TrabajoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Orden_de_TrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Orden_de_TrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Orden_de_TrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
