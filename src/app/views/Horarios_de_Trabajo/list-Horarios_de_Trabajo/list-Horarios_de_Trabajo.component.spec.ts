import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHorarios_de_TrabajoComponent } from './list-Horarios_de_Trabajo.component';

describe('ListHorarios_de_TrabajoComponent', () => {
  let component: ListHorarios_de_TrabajoComponent;
  let fixture: ComponentFixture<ListHorarios_de_TrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListHorarios_de_TrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHorarios_de_TrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
