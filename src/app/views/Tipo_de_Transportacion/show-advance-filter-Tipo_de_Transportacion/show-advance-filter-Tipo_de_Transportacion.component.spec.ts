import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_TransportacionComponent } from './show-advance-filter-Tipo_de_Transportacion.component';

describe('ShowAdvanceFilterTipo_de_TransportacionComponent', () => {
  let component: ShowAdvanceFilterTipo_de_TransportacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_TransportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_TransportacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_TransportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
