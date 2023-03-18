import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipos_de_Origen_del_ComponenteComponent } from './list-Tipos_de_Origen_del_Componente.component';

describe('ListTipos_de_Origen_del_ComponenteComponent', () => {
  let component: ListTipos_de_Origen_del_ComponenteComponent;
  let fixture: ComponentFixture<ListTipos_de_Origen_del_ComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipos_de_Origen_del_ComponenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipos_de_Origen_del_ComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
