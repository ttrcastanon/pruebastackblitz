import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInstalacionComponent } from './list-Instalacion.component';

describe('ListInstalacionComponent', () => {
  let component: ListInstalacionComponent;
  let fixture: ComponentFixture<ListInstalacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInstalacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
