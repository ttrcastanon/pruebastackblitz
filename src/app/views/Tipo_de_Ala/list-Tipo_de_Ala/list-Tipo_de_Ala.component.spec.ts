import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_AlaComponent } from './list-Tipo_de_Ala.component';

describe('ListTipo_de_AlaComponent', () => {
  let component: ListTipo_de_AlaComponent;
  let fixture: ComponentFixture<ListTipo_de_AlaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_AlaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_AlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
