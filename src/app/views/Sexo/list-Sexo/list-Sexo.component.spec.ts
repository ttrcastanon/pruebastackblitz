import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSexoComponent } from './list-Sexo.component';

describe('ListSexoComponent', () => {
  let component: ListSexoComponent;
  let fixture: ComponentFixture<ListSexoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSexoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSexoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
