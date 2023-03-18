import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_GastoComponent } from './show-advance-filter-Tipo_de_Gasto.component';

describe('ShowAdvanceFilterTipo_de_GastoComponent', () => {
  let component: ShowAdvanceFilterTipo_de_GastoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_GastoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_GastoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_GastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
