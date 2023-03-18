import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterLayout_Estado_de_ResultadoComponent } from './show-advance-filter-Layout_Estado_de_Resultado.component';

describe('ShowAdvanceFilterLayout_Estado_de_ResultadoComponent', () => {
  let component: ShowAdvanceFilterLayout_Estado_de_ResultadoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterLayout_Estado_de_ResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterLayout_Estado_de_ResultadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterLayout_Estado_de_ResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
