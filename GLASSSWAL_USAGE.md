# Glassmorphic SweetAlert2 Usage Guide

## Overview

This project includes a custom glassmorphic SweetAlert2 implementation that provides beautiful, consistent alerts throughout the application with your primary brand color (#d4af37).

## Features

- ✨ **Glassmorphic Design**: Beautiful frosted glass effect with backdrop blur
- 🎨 **Brand Colors**: Uses your primary color (#d4af37) for buttons and accents
- 📱 **Responsive**: Works perfectly on mobile and desktop
- 🌙 **Dark Mode**: Automatic dark mode support
- ⚡ **Animations**: Smooth entrance and exit animations
- 🎯 **TypeScript**: Full TypeScript support

## Installation

The glassmorphic SweetAlert2 is already installed and configured in your project.

## Usage

### Import

```typescript
import { GlassSwal } from "../../utils/glassSwal";
```

### Basic Usage

#### Success Alert

```typescript
GlassSwal.success("Successfully subscribed!", "Thank you for joining us.");
```

#### Error Alert

```typescript
GlassSwal.error("Something went wrong!", "Please try again later.");
```

#### Warning Alert

```typescript
GlassSwal.warning("Are you sure?", "This action cannot be undone.");
```

#### Info Alert

```typescript
GlassSwal.info("Information", "Here's some important information.");
```

#### Confirmation Dialog

```typescript
const result = await GlassSwal.confirm(
  "Delete Item?",
  "This action cannot be undone."
);

if (result.isConfirmed) {
  // User clicked "Yes"
  GlassSwal.success("Deleted!", "Item has been deleted.");
} else {
  // User clicked "No" or dismissed
  console.log("Deletion cancelled");
}
```

### Custom Alerts

For more control, use the `fire` method:

```typescript
GlassSwal.fire({
  title: "Custom Alert",
  text: "This is a custom glassmorphic alert",
  icon: "question",
  showCancelButton: true,
  confirmButtonText: "Yes, do it!",
  cancelButtonText: "Cancel",
  timer: 5000,
  timerProgressBar: true,
  allowOutsideClick: true,
  // Any other SweetAlert2 options...
});
```

### Advanced Example with Form

```typescript
const { value: email } = await GlassSwal.fire({
  title: "Enter your email",
  input: "email",
  inputPlaceholder: "Enter your email address",
  showCancelButton: true,
  confirmButtonText: "Submit",
  inputValidator: (value) => {
    if (!value) {
      return "You need to enter an email address!";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address!";
    }
  },
});

if (email) {
  GlassSwal.success("Thank you!", `We'll send updates to ${email}`);
}
```

## Available Methods

### Quick Methods

- `GlassSwal.success(title, text?)` - Auto-dismissing success alert
- `GlassSwal.error(title, text?)` - Error alert with confirm button
- `GlassSwal.warning(title, text?)` - Warning alert with confirm button
- `GlassSwal.info(title, text?)` - Info alert with confirm button
- `GlassSwal.confirm(title, text?)` - Confirmation dialog with Yes/No buttons

### Custom Method

- `GlassSwal.fire(options)` - Full control with any SweetAlert2 options

## Styling

The glassmorphic styles are automatically applied. The design includes:

- **Frosted glass background** with backdrop blur
- **Primary color accents** (#d4af37) for buttons and highlights
- **Smooth animations** with fade in/out effects
- **Responsive design** that works on all screen sizes
- **Dark mode support** that automatically adapts

## Examples Component

See `src/Component/Examples/SwalExamples.tsx` for a comprehensive demo of all alert types.

## Configuration

All alerts automatically use the glassmorphic styling. The styles are defined in:

- `src/styles/glassSwal.css` - CSS styles
- `src/utils/glassSwal.ts` - JavaScript configuration

## Browser Support

Works in all modern browsers that support:

- CSS `backdrop-filter`
- CSS `blur()` function
- ES6+ JavaScript features

## Tips

1. **Auto-dismiss**: Success alerts auto-dismiss after 3 seconds
2. **Keyboard support**: ESC key to close, Enter to confirm
3. **Consistent branding**: All alerts use your brand colors automatically
4. **Accessibility**: Full keyboard navigation and screen reader support
5. **Performance**: Lightweight with minimal bundle impact

## Migration from Regular Swal

Simply replace `Swal.fire()` with `GlassSwal.fire()` and enjoy the glassmorphic design!

```typescript
// Before
Swal.fire("Title", "Text", "success");

// After
GlassSwal.success("Title", "Text");
```
