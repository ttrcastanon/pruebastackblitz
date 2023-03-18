import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_DestinoComponent } from './show-advance-filter-Tipo_de_Destino.component';

describe('ShowAdvanceFilterTipo_de_DestinoComponent', () => {
  let component: ShowAdvanceFilterTipo_de_DestinoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_DestinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_DestinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_DestinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
