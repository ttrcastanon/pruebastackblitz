import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_AlaComponent } from './show-advance-filter-Tipo_de_Ala.component';

describe('ShowAdvanceFilterTipo_de_AlaComponent', () => {
  let component: ShowAdvanceFilterTipo_de_AlaComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_AlaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_AlaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_AlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
