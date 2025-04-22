
# Software Design Document (SDD)

**Project Title:** Hypertrophy Builder App  
**Company:** Kinertia Labs  
**Version:** 1.0  
**Date:** [Insert Date]  

---

## 1. Introduction

### 1.1 Purpose
This document provides the high-level and low-level software design for the Hypertrophy Builder App developed by Kinertia Labs. It outlines the system architecture, component design, data structures, and technologies used.

### 1.2 Scope
This design document covers the frontend, backend, and database design of the MVP version of the Hypertrophy Builder app. It will guide the implementation phase and ensure consistency in development.

---

## 2. System Overview

The application is a web-based hypertrophy training tool. It includes a user onboarding quiz, auto-generated workout plans, logging interface, and a basic progress tracker. It is mobile-first and supports user authentication and persistent storage.

---

## 3. Architecture Design

### 3.1 Frontend
- Framework: React (or Lovable.dev generated)
- Responsive design using Flexbox/Grid
- Pages:
  - Login/Signup
  - Onboarding Quiz
  - Dashboard (Today’s Workout)
  - Workout Logger
  - Progress Tracker
  - Exercise Library
  - Tips

### 3.2 Backend
- Platform: Supabase
- Services:
  - User authentication (JWT-based)
  - Realtime database (PostgreSQL)
  - RESTful API or auto-generated endpoints

---

## 4. Data Design

### 4.1 Key Tables

**Users**
- id (PK)
- email
- level (beginner/intermediate)
- days_available
- equipment

**Workouts**
- id (PK)
- user_id (FK)
- date
- day_number
- is_completed

**Workout_Logs**
- id (PK)
- workout_id (FK)
- exercise_name
- sets
- reps
- weight
- rir
- notes

**Exercises**
- id (PK)
- name
- muscle_group
- equipment
- tips
- image_url

---

## 5. Component Design

### 5.1 Workout Logger Component
- Accepts workout data props
- Includes input fields and validation
- Saves to `Workout_Logs` table on submit

### 5.2 Onboarding Quiz Component
- Collects user preferences
- Submits to `Users` table
- Triggers personalized plan generation

---

## 6. UI Design Summary

- Simple, card-based interface
- Primary colors: White, Blue, Gray
- Large buttons and touch-friendly controls
- Minimal text to reduce cognitive load

---

## 7. Tools and Libraries

- React or Lovable-generated frontend
- Supabase (Backend + Auth)
- Figma (for wireframes)
- GitHub (Version control)
- Netlify or Vercel (Deployment)

---

## 8. Future Considerations

- Add intermediate/advanced levels
- AI-based workout recommendations
- Export logs (CSV/PDF)
- Rest timer with notifications

