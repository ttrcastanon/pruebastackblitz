import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterNivel_de_RuidoComponent } from './show-advance-filter-Nivel_de_Ruido.component';

describe('ShowAdvanceFilterNivel_de_RuidoComponent', () => {
  let component: ShowAdvanceFilterNivel_de_RuidoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterNivel_de_RuidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterNivel_de_RuidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterNivel_de_RuidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
