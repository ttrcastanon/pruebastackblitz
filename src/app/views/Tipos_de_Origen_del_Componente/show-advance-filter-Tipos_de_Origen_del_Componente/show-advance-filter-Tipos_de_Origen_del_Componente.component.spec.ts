import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipos_de_Origen_del_ComponenteComponent } from './show-advance-filter-Tipos_de_Origen_del_Componente.component';

describe('ShowAdvanceFilterTipos_de_Origen_del_ComponenteComponent', () => {
  let component: ShowAdvanceFilterTipos_de_Origen_del_ComponenteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipos_de_Origen_del_ComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipos_de_Origen_del_ComponenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipos_de_Origen_del_ComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
