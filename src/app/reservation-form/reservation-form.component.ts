import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {

  reservationForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { };

  ngOnInit(): void {
    this.reservationForm = this.formBuilder.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', Validators.required]
    });

    // edit form data set
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id) {
      // let reservation = this.reservationService.getReservationById(id);
      // if(reservation) this.reservationForm.patchValue(reservation);
      this.reservationService.getReservationById(id).subscribe((reservation) => {
        if(reservation) this.reservationForm.patchValue(reservation);
      });
    }
  }

  onSubmit() {
    if(this.reservationForm.valid) {
      let reservation: Reservation = this.reservationForm.value;
      // identify if it is an update or add new reservation
      let id = this.activatedRoute.snapshot.paramMap.get('id');
      if (id) {
        // update reservation
        // this.reservationService.updateReservation(id, reservation);
        this.reservationService.updateReservation(id, reservation).subscribe(() => {
          console.log("Update request processed successfully");
        });
      } else {
        // add new reservation       
        // this.reservationService.addReservation(reservation);
        this.reservationService.addReservation(reservation).subscribe(() => {
          console.log("Add request processed successfully");
        });
      }
      this.router.navigate(['/list']);
    }
  }



}
