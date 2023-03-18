import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListImpresion_de_Bitacora_de_VueloComponent } from './list-Impresion_de_Bitacora_de_Vuelo.component';

describe('ListImpresion_de_Bitacora_de_VueloComponent', () => {
  let component: ListImpresion_de_Bitacora_de_VueloComponent;
  let fixture: ComponentFixture<ListImpresion_de_Bitacora_de_VueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListImpresion_de_Bitacora_de_VueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListImpresion_de_Bitacora_de_VueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
