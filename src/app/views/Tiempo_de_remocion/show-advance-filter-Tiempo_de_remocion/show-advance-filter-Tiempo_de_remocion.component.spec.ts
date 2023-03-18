import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTiempo_de_remocionComponent } from './show-advance-filter-Tiempo_de_remocion.component';

describe('ShowAdvanceFilterTiempo_de_remocionComponent', () => {
  let component: ShowAdvanceFilterTiempo_de_remocionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTiempo_de_remocionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTiempo_de_remocionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTiempo_de_remocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
