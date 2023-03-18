import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterListado_de_MaterialesComponent } from './show-advance-filter-Listado_de_Materiales.component';

describe('ShowAdvanceFilterListado_de_MaterialesComponent', () => {
  let component: ShowAdvanceFilterListado_de_MaterialesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterListado_de_MaterialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterListado_de_MaterialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterListado_de_MaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
