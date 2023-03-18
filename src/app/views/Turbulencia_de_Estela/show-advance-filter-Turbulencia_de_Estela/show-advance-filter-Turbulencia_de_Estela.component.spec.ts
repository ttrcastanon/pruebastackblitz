import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTurbulencia_de_EstelaComponent } from './show-advance-filter-Turbulencia_de_Estela.component';

describe('ShowAdvanceFilterTurbulencia_de_EstelaComponent', () => {
  let component: ShowAdvanceFilterTurbulencia_de_EstelaComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTurbulencia_de_EstelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTurbulencia_de_EstelaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTurbulencia_de_EstelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
