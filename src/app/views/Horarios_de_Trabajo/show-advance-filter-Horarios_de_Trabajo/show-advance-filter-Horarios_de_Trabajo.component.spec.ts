import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterHorarios_de_TrabajoComponent } from './show-advance-filter-Horarios_de_Trabajo.component';

describe('ShowAdvanceFilterHorarios_de_TrabajoComponent', () => {
  let component: ShowAdvanceFilterHorarios_de_TrabajoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterHorarios_de_TrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterHorarios_de_TrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterHorarios_de_TrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
