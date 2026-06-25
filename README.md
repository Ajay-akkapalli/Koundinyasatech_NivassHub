# NivassHub

**Modern Society Management Platform**

Developed by Koundinyasatech
npm install expo@~54.0.0 --legacy-peer-deps

---

## Overview

NivassHub is a comprehensive residential society management mobile application built with React Native and Expo. It provides a complete suite of tools for managing residents, visitors, maintenance requests, amenities, notices, and more — all powered by local JSON data with no backend required.

---

## Tech Stack

| Technology | Version |
|---|---|
| React Native | 0.74.0 |
| Expo | ~51.0.0 |
| Expo Router | ~3.5.0 |
| Redux Toolkit | ^2.2.5 |
| React Redux | ^9.1.2 |
| AsyncStorage | 1.23.1 |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios
```

---

## App Flow

```
Launch → Splash Screen (NivassHub) → Dashboard → Modules
```

No login, no authentication, no backend. All data is loaded from local JSON files.

---

## Features

### Dashboard
- Society overview stats (residents, flats, visitors, collections, complaints)
- Quick access navigation grid
- Recent activity feed
- Notification badge

### Residents
- Complete resident directory (25 records)
- Search by name or flat number
- Filter by Active / Inactive status
- Resident cards with avatar, flat info, contact details

### Visitors
- Visitor log with check-in / check-out status
- Search by name or host flat
- Filter by In / Out status
- Visit purpose and gate tracking

### Maintenance
- Maintenance request tracker (25 records)
- Status: Open, In Progress, Resolved
- Priority levels: Low, Medium, High, Critical
- Category-based organization

### Amenities
- Club House, Gym, Swimming Pool, Community Hall, Parking Area
- Status, capacity, timings, booking info
- Facility lists and upcoming bookings

### Notices & Alerts
- 3 tabs: Notices, Announcements, Notifications
- Priority indicators and unread badges
- Pinned announcements

### Profile
- Editable resident profile
- Persisted with AsyncStorage

### Settings
- Notification toggles
- App info and society details
- Persisted with AsyncStorage

---

## Project Structure

```
app/               Expo Router screens
components/        Reusable UI components
data/              Local JSON data files
store/             Redux store and slices
hooks/             Custom React hooks
services/          Storage services
constants/         App constants
theme/             Colors, typography, spacing
utils/             Helper utilities
```

---

## Data Files

| File | Records |
|---|---|
| residents.json | 25 residents |
| visitors.json | 25 visitors |
| maintenance.json | 25 requests |
| amenities.json | 5 amenities |
| notices.json | 15 notices |
| announcements.json | 15 announcements |
| notifications.json | 25 notifications |

---

## License

© 2024 Koundinyasatech. All rights reserved.
