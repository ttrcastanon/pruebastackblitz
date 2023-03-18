import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRespuestaComponent } from './list-Respuesta.component';

describe('ListRespuestaComponent', () => {
  let component: ListRespuestaComponent;
  let fixture: ComponentFixture<ListRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRespuestaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
