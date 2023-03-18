import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_CambioComponent } from './show-advance-filter-Tipo_de_Cambio.component';

describe('ShowAdvanceFilterTipo_de_CambioComponent', () => {
  let component: ShowAdvanceFilterTipo_de_CambioComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_CambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_CambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_CambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
