import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterRespuestaComponent } from './show-advance-filter-Respuesta.component';

describe('ShowAdvanceFilterRespuestaComponent', () => {
  let component: ShowAdvanceFilterRespuestaComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterRespuestaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
