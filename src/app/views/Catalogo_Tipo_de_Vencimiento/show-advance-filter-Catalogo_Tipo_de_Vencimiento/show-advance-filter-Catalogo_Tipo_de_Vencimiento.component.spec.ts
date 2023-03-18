import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCatalogo_Tipo_de_VencimientoComponent } from './show-advance-filter-Catalogo_Tipo_de_Vencimiento.component';

describe('ShowAdvanceFilterCatalogo_Tipo_de_VencimientoComponent', () => {
  let component: ShowAdvanceFilterCatalogo_Tipo_de_VencimientoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCatalogo_Tipo_de_VencimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCatalogo_Tipo_de_VencimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCatalogo_Tipo_de_VencimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
