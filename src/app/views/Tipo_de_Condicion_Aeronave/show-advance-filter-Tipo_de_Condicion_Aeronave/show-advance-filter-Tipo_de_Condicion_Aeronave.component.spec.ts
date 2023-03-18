import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Condicion_AeronaveComponent } from './show-advance-filter-Tipo_de_Condicion_Aeronave.component';

describe('ShowAdvanceFilterTipo_de_Condicion_AeronaveComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Condicion_AeronaveComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Condicion_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Condicion_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Condicion_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
