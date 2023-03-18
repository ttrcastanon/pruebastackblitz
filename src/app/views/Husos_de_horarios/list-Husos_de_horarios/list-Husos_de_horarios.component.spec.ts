import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHusos_de_horariosComponent } from './list-Husos_de_horarios.component';

describe('ListHusos_de_horariosComponent', () => {
  let component: ListHusos_de_horariosComponent;
  let fixture: ComponentFixture<ListHusos_de_horariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListHusos_de_horariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHusos_de_horariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
