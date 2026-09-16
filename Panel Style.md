This document describes the new plan for styling the panels on the website. Each panel is a rounded rectangle, with a
thin border and no drop shadow. 

## Panel title element

Previously, the panel title, X button, and drag handle were all inside of the rectangle.
This will no longer be the case. Instead, there will be a new panel title element that has the title and an x button in it.
The entire panel title element (execpt the x button) serves as a drag handle for the entire panel.

The panel title element will be positioned as followed:
- left: 1em to the right of the left of the panel.
- top: 1em above the top of the panel.
- bottom: 1em below the top of the panel.
- right: as needed to fit panel title and x button.

In other words, the panel title element straddles the top of the panel.

The panel title element should only be visible when the mouse is over the panel title element or the panel.

When the mouse is over the panel title element, increase the border width of the panel.
