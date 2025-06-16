# Availability App (Frontend)

A modern Vue 3 application for visualizing and managing room availability, designed to work seamlessly with the [Booking API].

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [API Integration](#api-integration)
- [Development](#development)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Interactive Calendar**: View and manage room availability by day, week, or month. (Powered by [FullCalendar](https://fullcalendar.io/) / [vue-cal](https://antoniandre.github.io/vue-cal/) or your chosen package)
- **Filter & Search**: Filter by property, room, date range, and guest count.
- **API Token Authentication**: Secure requests to the backend using a Bearer token.
- **Real-time Updates**: Reflects changes in availability instantly.

---

## Requirements

- **Node.js** (v18+ recommended)
- **npm** (v9+) or **yarn**
- [Booking API] running and accessible

---

## Installation

```bash
git clone <your-repository-url>
cd availability-app
npm install
# or
yarn install
```

### Calendar Package

This project uses a calendar component for the main availability view. Example:

- [FullCalendar](https://fullcalendar.io/)

---

## Configuration

1. **Backend Setup**

   Ensure the [Booking API] is running and accessible at the URL you set above.

---

## Running the App

```bash
npm run dev
# or
yarn dev
```

- The app will be available at [http://localhost:5173](http://localhost:5173) (or as shown in your terminal).

---

## API Integration

- All requests to the backend API are authenticated using the Bearer token from your `.env` file.
- Example Axios setup (in `src/api.js`):

  ```js
  import axios from 'axios';

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
    },
  });

  export default api;
  ```

- The endpoint used:
  - `GET /availability`

### /availability Endpoint Parameters

**GET /availability** accepts the following query parameters:

- `property_id` (string, required): The unique identifier of the property to check.
- `check_in` (date, required): The check-in date (format: YYYY-MM-DD).
- `check_out` (date, required): The check-out date (format: YYYY-MM-DD, exclusive; the guest leaves on this day).
- `guests` (integer, required): The number of guests.
- `full_availability` (boolean, optional): If true, returns all rooms with their daily availabilities; if false or omitted, returns only rooms available for every night in the range.

**Example request:**

```
GET /availability?property_id=property-123&check_in=2024-07-01&check_out=2024-07-04&guests=2&full_availability=true
```

**Example response:**

```json
{
  "reply": {
    "status": "success",
    "property_id": "property-123",
    "rooms": [
      {
        "room_id": "room-1",
        "max_guests": 2,
        "total_price": 360
      }
    ]
  }
}
```

## API Authentication
Most endpoints require authentication via a Bearer token (Laravel Sanctum). You can obtain a token by:
- Using the fixed token created by the migration (see migration file for the value).
- Registering a user via `/api/register` and then logging in via `/api/login` to receive a token. (e.g. postman)

### How to Get an API Token

**Register and Log In (for real users)**
1. Register a new user:
   ```bash
   curl -X POST http://localhost:8080/api/register \
     -H "Content-Type: application/json" \
     -d '{"name": "Your Name", "email": "your@email.com", "password": "yourpassword", "password_confirmation": "yourpassword"}'
   ```
2. Log in to get a token:
   ```bash
   curl -X POST http://localhost:8080/api/login \
     -H "Content-Type: application/json" \
     -d '{"email": "your@email.com", "password": "yourpassword"}'
   ```
   The response will include an `access_token`

Include the token in the `Authorization` header:
```
Authorization: Bearer <your_token>
```

---

## Development

- **Component-based**: All UI is built with Vue 3 SFCs (Single File Components).
- **Styling**: Uses CSS.

---

## Project Structure

```
availability-app/
├── public/
├── src/
│   ├── components/         # Vue components (e.g., AvailabilityCalendar.vue)
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js
```

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

---

## License

[MIT](LICENSE)

---

**Questions?**  
Open an issue or contact the maintainer.
