import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterHistorial_de_CambiosComponent } from './show-advance-filter-Historial_de_Cambios.component';

describe('ShowAdvanceFilterHistorial_de_CambiosComponent', () => {
  let component: ShowAdvanceFilterHistorial_de_CambiosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterHistorial_de_CambiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterHistorial_de_CambiosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterHistorial_de_CambiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
