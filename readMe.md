# Vaccine Reservation

## Description
Booking system for vaccination centre.

## Endpoint

### Centre
#### GET  /api/centre
- Get all centre
#### POST /api/centre/new
- Create new centre
#### PUT /api/centre/update/:centreId
- Update centre

### Booking
#### GET /api/bookingTable/availability/:centreId/:date
- Get all available centre booking date

#### GET /api/bookingTable/centre-booking/:centreId
- Get all centre booking

#### GET /api/bookingTable/user-booking/:userId
- Get user booking

#### POST /api/bookingTable/new
- Create new booking

### User
#### PUT /api/bookingTable/edit-booking/:userId
- Update user booking

#### DELETE /api/bookingTable/:userId
- Delete user booking
