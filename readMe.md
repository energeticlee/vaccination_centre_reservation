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

## Installation

1) git clone https://github.com/energeticlee/vaccination_centre_reservation.git
2) cd vaccination_centre_reservation
3) yarn install-client
4) yarn build
5) yarn install
6) yarn dev
7) open chrome and go to http://localhost:3333/
