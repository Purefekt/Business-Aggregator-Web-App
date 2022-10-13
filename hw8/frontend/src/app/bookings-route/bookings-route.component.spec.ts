import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsRouteComponent } from './bookings-route.component';

describe('BookingsRouteComponent', () => {
  let component: BookingsRouteComponent;
  let fixture: ComponentFixture<BookingsRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingsRouteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
