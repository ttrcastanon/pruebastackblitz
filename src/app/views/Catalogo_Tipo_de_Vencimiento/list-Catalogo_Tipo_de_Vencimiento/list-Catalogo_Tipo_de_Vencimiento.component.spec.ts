import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCatalogo_Tipo_de_VencimientoComponent } from './list-Catalogo_Tipo_de_Vencimiento.component';

describe('ListCatalogo_Tipo_de_VencimientoComponent', () => {
  let component: ListCatalogo_Tipo_de_VencimientoComponent;
  let fixture: ComponentFixture<ListCatalogo_Tipo_de_VencimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCatalogo_Tipo_de_VencimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCatalogo_Tipo_de_VencimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
