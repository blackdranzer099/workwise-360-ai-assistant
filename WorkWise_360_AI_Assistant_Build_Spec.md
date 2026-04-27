# Antigravity Build Spec — WorkWise 360 AI Assistant Chatbot

## Objective

Build a premium, modern enterprise chatbot UI for **WorkWise 360 AI Assistant** with a backend powered by SnapLogic APIs.

## Product Vision

An intelligent workplace assistant where employees can ask questions and receive real-time responses from WorkWise 360 services:

* Notifications
* Attendance
* Support Requests
* Timesheets
* Projects
* Daily Summary

## Tech Stack

* React + TypeScript
* Tailwind CSS
* shadcn/ui components
* Framer Motion animations
* Lucide icons
* Axios for API calls
* Responsive design

## Design Direction

Create an **advanced, futuristic enterprise dashboard chatbot**.

### Visual Style

* Dark glassmorphism theme
* Soft gradients
* Floating cards
* Smooth transitions
* Rounded 2xl containers
* Premium SaaS look
* Clean typography
* Subtle shadows

### Color Palette

* Background: deep slate / charcoal
* Accent: cyan / blue / violet gradients
* Success: emerald
* Warning: amber
* Error: rose

## Layout

### Desktop

Two-column layout:

1. Left sidebar

   * Logo: WorkWise AI
   * Quick Actions
   * Recent Queries
   * User Profile
2. Main Chat Area

   * Header with status
   * Chat messages
   * Suggested prompts
   * Input composer

### Mobile

Single-column responsive layout.

## Header

Include:

* Bot avatar icon
* Title: WorkWise AI Assistant
* Subtitle: Connected to SnapLogic Live Services
* Online pulse indicator
* Current date/time

## Sidebar Quick Actions

Buttons:

* Daily Summary
* Notifications
* Attendance
* Support Requests
* Timesheet Status
* Assigned Projects
* Clear Chat

## Chat Experience

### Bot Message Cards

Use elevated cards with icons and animated entrance.

### User Messages

Right aligned bubble with gradient background.

### Typing State

Animated dots while awaiting API response.

### Empty State

Show hero section:
"Ask me anything about your WorkWise day"

Suggested chips:

* Give me my workday summary
* Do I have notifications today?
* What is my attendance?
* Any pending support requests?
* Show my projects

## Input Composer

Sticky bottom input area:

* Multiline textbox
* Send button
* Voice icon placeholder
* Enter to send
* Disabled while loading

## API Integration Contract

POST `/api/chat`

Request:

```json
{
  "employeeId": "GACSP056",
  "question": "Give me my workday summary"
}
```

Response:

```json
{
  "reply": "You have 3 notifications, checked in at 9:08 AM, and 1 support request pending.",
  "cards": {
    "notifications": 3,
    "attendance": "Present",
    "support": 1,
    "timesheet": "Submitted"
  }
}
```

## Rich Response Widgets

If response includes cards, render KPI cards:

* Notifications count
* Attendance status
* Open requests
* Timesheet status

## Advanced Features

### Smart Prompt Detection

Map quick phrases:

* notifications
* attendance
* support
* summary
* projects

### Conversation Memory

Maintain last 10 prompts locally.

### Retry Handling

If API fails:
"Live services unavailable. Please try again."

### Loading Skeletons

Use shimmer placeholders.

### Toast Notifications

Success / error toasts.

## Animations

* Fade in messages
* Slide up cards
* Hover scale buttons
* Smooth page transitions

## Accessibility

* Keyboard navigable
* High contrast text
* ARIA labels
* Focus states

## Deliverables

Build these files:

* `App.tsx`
* `components/Sidebar.tsx`
* `components/ChatWindow.tsx`
* `components/MessageBubble.tsx`
* `components/QuickActions.tsx`
* `services/api.ts`
* `types.ts`

## Backend Stub

If backend unavailable, mock realistic responses.

## Priority UX Goal

Make users say: **This looks enterprise-grade and premium.**
