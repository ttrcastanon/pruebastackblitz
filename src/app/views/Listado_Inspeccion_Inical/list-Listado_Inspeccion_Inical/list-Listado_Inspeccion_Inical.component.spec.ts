import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListListado_Inspeccion_InicalComponent } from './list-Listado_Inspeccion_Inical.component';

describe('ListListado_Inspeccion_InicalComponent', () => {
  let component: ListListado_Inspeccion_InicalComponent;
  let fixture: ComponentFixture<ListListado_Inspeccion_InicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListListado_Inspeccion_InicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListListado_Inspeccion_InicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
