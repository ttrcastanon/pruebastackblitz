import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Bitacora_de_AeronaveComponent } from './show-advance-filter-Tipo_de_Bitacora_de_Aeronave.component';

describe('ShowAdvanceFilterTipo_de_Bitacora_de_AeronaveComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Bitacora_de_AeronaveComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Bitacora_de_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Bitacora_de_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Bitacora_de_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
