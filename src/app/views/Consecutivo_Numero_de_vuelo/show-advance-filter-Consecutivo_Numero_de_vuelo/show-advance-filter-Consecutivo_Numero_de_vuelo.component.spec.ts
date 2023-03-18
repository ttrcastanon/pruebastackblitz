import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterConsecutivo_Numero_de_vueloComponent } from './show-advance-filter-Consecutivo_Numero_de_vuelo.component';

describe('ShowAdvanceFilterConsecutivo_Numero_de_vueloComponent', () => {
  let component: ShowAdvanceFilterConsecutivo_Numero_de_vueloComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterConsecutivo_Numero_de_vueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterConsecutivo_Numero_de_vueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterConsecutivo_Numero_de_vueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
