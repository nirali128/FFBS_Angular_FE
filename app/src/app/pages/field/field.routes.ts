import { Routes } from '@angular/router';
import { FieldComponent } from './field.component';
import { FieldBookingComponent } from './booking/field-booking/field-booking.component';

export default [
    {
        path: '',
        component: FieldComponent,
    },
    {
        path: 'booking/:id',
        component: FieldBookingComponent
    }
] as Routes;
