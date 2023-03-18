import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMedio_de_ComunicacionComponent } from './list-Medio_de_Comunicacion.component';

describe('ListMedio_de_ComunicacionComponent', () => {
  let component: ListMedio_de_ComunicacionComponent;
  let fixture: ComponentFixture<ListMedio_de_ComunicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMedio_de_ComunicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMedio_de_ComunicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
