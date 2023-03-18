import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTiempo_de_remocionComponent } from './list-Tiempo_de_remocion.component';

describe('ListTiempo_de_remocionComponent', () => {
  let component: ListTiempo_de_remocionComponent;
  let fixture: ComponentFixture<ListTiempo_de_remocionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTiempo_de_remocionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTiempo_de_remocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
