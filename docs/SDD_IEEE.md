
# Software Design Document (SDD)

**Project Title:** Hypertrophy Builder App  
**Company:** Kinertia Labs  
**Version:** 1.0  
**Date:** [Insert Date]  

---

## 1.0 Introduction

### 1.1 Purpose
This document outlines the software design for the Kinertia Labs Hypertrophy Builder App, detailing architectural, data, component, and user interface designs to guide implementation.

### 1.2 Scope
The app is a web-based hypertrophy training tool for beginners that provides guided workout plans, workout logging, and progress tracking.

### 1.3 Overview
This SDD includes architecture diagrams, modular breakdowns, data dictionaries, and UI overviews to support full-stack development.

### 1.4 Reference Material
- Supabase Documentation
- IEEE Software Design Document Guidelines
- Kinertia Labs SRS

### 1.5 Definitions and Acronyms
- **RIR** – Reps In Reserve
- **UI** – User Interface
- **UX** – User Experience
- **API** – Application Programming Interface

---

## 2.0 System Overview

The Hypertrophy Builder App is mobile-first, web-based, and targets users new to strength training. It features user onboarding, personalized plan generation, a workout logger, and visual progress tracking.

---

## 3.0 System Architecture

### 3.1 Architectural Description
- Frontend: React or Lovable.dev
- Backend: Supabase (Auth + DB + REST)
- Deployment: Vercel/Netlify

### 3.2 Decomposition Description

#### 3.2.1 User Account Management Module
- Handles user login, sign-up, onboarding preferences
- Integrates with Supabase Auth

#### 3.2.2 Workout Management Module
- Generates plans based on onboarding input
- Tracks completion and stores logs

#### 3.2.3 Educational & UI Helper Module
- Displays fitness terms, tooltips, and user tips

#### 3.2.4 Data Management Module
- Reads/writes workout logs and user preferences from/to Supabase
- Returns historical progress

### 3.3 Design Rationale
- Modular structure supports feature expansion
- Supabase eliminates need for custom backend initially
- Simplicity supports beginner users without tech clutter

---

## 4.0 Data Design

### 4.1 Data Description
Data is stored in Supabase PostgreSQL tables with relations between users, workouts, and logs.

### 4.2 Data Dictionary

**Users Table**  
- id: UUID (Primary Key)  
- email: String  
- level: String (e.g., Beginner)  
- days_available: Integer  
- equipment: String

**Workouts Table**  
- id: UUID  
- user_id: FK  
- date: Date  
- split_day: Integer  
- is_completed: Boolean

**Workout_Logs Table**  
- id: UUID  
- workout_id: FK  
- exercise_name: String  
- sets: Integer  
- reps: Integer  
- weight: Decimal  
- rir: Integer  
- notes: Text

**Exercises Table**  
- id: UUID  
- name: String  
- muscle_group: String  
- equipment: String  
- tips: Text  
- image_url: Text

---

## 5.0 Component Design

- **Onboarding Component**: Collects user input and saves to Users table
- **Workout Logger**: Accepts sets/reps/weight input, saves to logs
- **Dashboard Widget**: Shows upcoming or recent workouts
- **Exercise Viewer**: Displays exercise image, tips, and details

---

## 6.0 Human Interface Design

### 6.1 Overview of User Interface
- Dashboard with today's workout
- Logger with inline input fields
- Calendar view for completed workouts
- Minimalist, mobile-friendly layout

### 6.2 Screen Images
[To be filled with Figma or wireframe exports]

### 6.3 Screen Objects and Actions
- **Start Workout Button** – Loads today’s routine
- **Complete Set Button** – Saves each logged set
- **Next Exercise** – Moves to the next item
- **End Workout** – Submits logs and updates history

---

## 7.0 Requirements Matrix

| Requirement | Design Element |
|-------------|----------------|
| FR1 - Auth/Login | User Management Module |
| FR2 - Quiz | Onboarding Component |
| FR3 - Auto Split | Workout Generator Logic |
| FR4 - Logging | Workout Logger |
| FR5 - Progress View | Dashboard + Calendar |
| FR6 - Exercise Library | Exercise Viewer |
| FR7 - Tips | Helper Module |

