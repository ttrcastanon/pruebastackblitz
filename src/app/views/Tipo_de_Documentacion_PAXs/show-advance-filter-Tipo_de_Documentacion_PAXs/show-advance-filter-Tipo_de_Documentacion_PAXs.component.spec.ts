import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Documentacion_PAXsComponent } from './show-advance-filter-Tipo_de_Documentacion_PAXs.component';

describe('ShowAdvanceFilterTipo_de_Documentacion_PAXsComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Documentacion_PAXsComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Documentacion_PAXsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Documentacion_PAXsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Documentacion_PAXsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
