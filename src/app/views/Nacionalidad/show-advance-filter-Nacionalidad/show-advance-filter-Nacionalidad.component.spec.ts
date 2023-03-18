import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterNacionalidadComponent } from './show-advance-filter-Nacionalidad.component';

describe('ShowAdvanceFilterNacionalidadComponent', () => {
  let component: ShowAdvanceFilterNacionalidadComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterNacionalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterNacionalidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterNacionalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
