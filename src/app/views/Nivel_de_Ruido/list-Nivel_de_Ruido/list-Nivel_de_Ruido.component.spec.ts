import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNivel_de_RuidoComponent } from './list-Nivel_de_Ruido.component';

describe('ListNivel_de_RuidoComponent', () => {
  let component: ListNivel_de_RuidoComponent;
  let fixture: ComponentFixture<ListNivel_de_RuidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListNivel_de_RuidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNivel_de_RuidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
