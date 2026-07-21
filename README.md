# Persistent Form

A multi step form application built with vanilla HTML, CSS, and JavaScript that saves all user progress directly to the browser using localStorage. Every input, selection, and navigation state is preserved automatically so users always resume exactly where they left off.


## Features

**Automatic Data Persistence**
Every field change triggers an immediate save to localStorage. The current step, all text inputs, select values, checkbox states, and radio selections are stored as a single JSON object. Returning to the page at any time restores every piece of saved data and navigates the user back to their last active step.

**Three Step Form Flow**
The form is organized into three sequential steps, each focusing on a distinct category of information.

Step 1 collects personal details including full name, email address, phone number, age, and gender.

Step 2 gathers preferences such as professional role, experience level, notification settings, and appearance theme.

Step 3 presents a complete summary of all entered data for review before final submission.

**Progress Visualization**
A radial progress ring in the sidebar updates in real time as the user advances through steps. The stepper navigation at the top displays numbered milestones connected by an animated progress line that fills as each step is completed.

**Form Clearing**
A dedicated Clear Form button opens a confirmation dialog. Confirming the action erases all stored data, resets every field to its default state, and returns the form to Step 1.

**Submit and Reset**
The final submission clears all localStorage data and displays a success confirmation. A Start New Submission button allows the user to begin a fresh form immediately.

**Responsive Layout**
The interface adapts seamlessly across desktop, laptop, tablet, and mobile viewports. The two column layout on desktop collapses to a single column on smaller screens while maintaining full functionality and visual clarity.


## Technologies

The project uses only vanilla web technologies with zero framework dependencies.

**HTML5** provides the semantic structure including main, header, nav, section, aside, footer, fieldset, legend, dialog, and labeled form controls.

**CSS3** handles all visual styling through custom properties for colors, spacing, typography, shadows, and radii. The design follows an eight pixel spacing grid and a modular type scale using the Inter font family.

**JavaScript (ES5 compatible)** manages form state, step navigation, localStorage operations, and DOM updates. The entire script runs inside an immediately invoked function expression to keep all variables in a private scope.

**Lucide Icons** supplies the vector icon set used throughout the interface for inputs, buttons, navigation indicators, and status markers.


## Project Structure

```
persistent-form/
  index.html      The complete semantic markup for all three form steps,
                  the header, stepper navigation, sidebar, footer, and
                  confirmation dialog.
  styles.css      All visual styling including design tokens, component
                  styles, layout rules, and responsive breakpoints.
  app.js          Form logic, localStorage management, step navigation,
                  data collection, and event handling.
```


## Getting Started

**Step 1: Download or clone the project files into a local directory.**

**Step 2: Open the index.html file directly in any modern web browser.** The application runs entirely on the client side so a server is optional for local development. All three files must remain in the same directory for proper loading.

**Step 3: Begin filling out the form.** Every keystroke and selection saves automatically. Close the browser tab, reopen it, and observe that all data and the current step are restored instantly.


## How localStorage Works

The application stores form data under a single key called persistent-form-data. The stored object includes every form field value along with the current step number.

```
{
  "fullName": "Jane Mwangi",
  "email": "jane@example.com",
  "phone": "+254712345678",
  "age": "28",
  "gender": "Female",
  "role": "developer",
  "experience": "senior",
  "notifyEmail": true,
  "notifySms": false,
  "notifyNewsletter": true,
  "theme": "light",
  "currentStep": 2
}
```

**Save triggers:**
Text inputs save on the input event, which fires with every keystroke.
Select dropdowns, checkboxes, and radio buttons save on the change event, which fires when the selection changes.
Step navigation saves the updated currentStep value on every transition.

**Load behavior:**
On page load, the application reads the stored JSON string, parses it, and populates every matching form field. The currentStep value determines which form step to display. The progress ring and stepper indicators update to reflect the restored position.

**Clear behavior:**
Both the Clear Form action and the final Submit action call localStorage.removeItem with the stored key, fully erasing all saved data.


## Accessibility

The form implements accessibility best practices throughout.

Every form input has an associated label element connected via the for attribute.

All interactive buttons include descriptive aria-label attributes.

The stepper navigation uses aria-current on the active step and aria-label on each step circle.

The progress ring SVG is marked as aria-hidden since it is decorative.

Fieldset and legend elements group related controls such as gender selection and notification preferences.

Focus visible outlines appear on all interactive elements using a purple ring that meets WCAG contrast requirements.

Keyboard navigation works across all buttons, inputs, selects, and radio groups.


## Browser Compatibility

The application works in all modern browsers that support CSS custom properties, CSS Grid, the :has() pseudo class, and the HTML dialog element.

Supported browsers include Chrome 105 and above, Firefox 121 and above, Safari 15.4 and above, and Edge 105 and above.

The dialog element used for the clear confirmation requires a modern browser. As a progressive enhancement, the form remains fully functional even if the dialog is unavailable.


## Color Palette

The design uses a carefully defined set of colors stored as CSS custom properties.

The primary brand color is a purple range from light lavender (#F3EEFF) through the main accent (#6C3CF0) to deep violet (#3A1F9E).

Neutral tones range from dark navy (#1B2340) for headings through charcoal (#3B4354) for body text to pale gray (#E7EAF2) for borders.

Success states use emerald green (#22C55E). Destructive actions use crimson (#EF4444).

The page background is a subtle gradient from near white (#FAFAFF) to soft lavender (#F5F2FF).


## Typography

The type system uses the Inter font family loaded from Google Fonts with four weights: regular at 400, medium at 500, semibold at 600, and bold at 700.

Heading sizes follow a modular scale from 0.75rem to 1.75rem. Body text uses 0.9375rem as the base size. Line heights are tight at 1.25 for headings, normal at 1.5 for body text, and relaxed at 1.65 for longer descriptions.


## License

This project is provided as an educational demonstration of localStorage persistence with multi step form logic. You are welcome to use, modify, and distribute the code for any purpose.
