import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_BoletinComponent } from './show-advance-filter-Tipo_de_Boletin.component';

describe('ShowAdvanceFilterTipo_de_BoletinComponent', () => {
  let component: ShowAdvanceFilterTipo_de_BoletinComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_BoletinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_BoletinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_BoletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
