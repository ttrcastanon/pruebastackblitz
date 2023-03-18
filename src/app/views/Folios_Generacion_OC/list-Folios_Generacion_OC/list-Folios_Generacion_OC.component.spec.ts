import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFolios_Generacion_OCComponent } from './list-Folios_Generacion_OC.component';

describe('ListFolios_Generacion_OCComponent', () => {
  let component: ListFolios_Generacion_OCComponent;
  let fixture: ComponentFixture<ListFolios_Generacion_OCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFolios_Generacion_OCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFolios_Generacion_OCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
