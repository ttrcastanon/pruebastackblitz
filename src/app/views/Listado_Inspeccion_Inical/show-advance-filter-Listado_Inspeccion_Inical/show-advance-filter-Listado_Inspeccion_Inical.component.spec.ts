import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterListado_Inspeccion_InicalComponent } from './show-advance-filter-Listado_Inspeccion_Inical.component';

describe('ShowAdvanceFilterListado_Inspeccion_InicalComponent', () => {
  let component: ShowAdvanceFilterListado_Inspeccion_InicalComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterListado_Inspeccion_InicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterListado_Inspeccion_InicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterListado_Inspeccion_InicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
