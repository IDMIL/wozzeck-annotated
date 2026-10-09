# How to use this site

The *Wozzeck* Annotated Score contains several synchronized panels, which can be used in tandem for a variety of 
analytical tasks. For instance, a performer might use the video panel, the structure panel, and the score panel
to practice a section of the opera, while an analyst might use the annotation panel and the Garant score panel to
compare interpretations.

## Opening and closing the panels

At the bottom of the window is a list of all available panels. Check or uncheck the box next to a panel name to show
or hide it. Panels can also be closed by hovering over the panel and clicking the x button next to the panel name on
desktop, or clicking the x in the top right corner of the panel on mobile.

## Detailed overview of the panels

### Structure of the Opera

This timeline section at the top of the screen allows for quick navigation through the entire work. Click on an act or
scene to go to the beginning of that section, or click on a measure in the third row to go to that measure. (In *Wozzeck*,
measures are numbered starting from 1 at the beginning of each act.)

### Navigation

The navigation panel is another utility for quickly navigating to a specific point in the work. Click on an act or
measure number, or type in a page number in the Universal Edition full score or a measure number
within the current act.

### Annotations

The annotation panel presents annotations transcribed from the three analysts' notes, as well as an option for the user
to create annotations of their own. Each annotation refers to a page, measure, or measure range in the score, and
the annotations are ordered chronologically. Clicking on an annotation navigates to that position in the score. 

Annotations have one or more categories, which are indicated by the coloured dots next to the annotation.
The category names are at the top of the annotation section. Clicking on a category shows only the annotations in that category.

#### Adding your own annotations

To create an annotation, click the + button next to the search bar. A form opens beside the annotation panel, with the
act, scene, and measure set to the current position in the score; change these if you want the annotation to refer to
another measure. Choose one or more categories, type the text of the annotation, and click Add. Your annotation then
appears in the list alongside the analysts' annotations, under the source "User".

If you check the Graphical category, a drawing panel opens showing the current page of the full score. Use the pen to
draw on the page and the eraser to remove marks, adjust the size of either tool with the slider, and use the Undo
(Ctrl+Z), Redo (Ctrl+Shift+Z), and Clear buttons as needed. When you add the annotation, the drawing is saved with it
and appears on top of the full score panel whenever that page is displayed.

To change one of your annotations, click the ✎ button next to it, make your changes in the form, and click Save. To
remove it, click the ✕ button. Only annotations you have created can be edited or deleted.

#### Downloading and uploading annotations

Your annotations are saved in your browser, so they will still be there when you return to the site on the same
computer and browser. They are not sent anywhere else, and will be lost if you clear your browser's data. To keep a copy
of them, or to move them to another device or share them with someone else, click the ↓ button next to the search bar.
This downloads all of your annotations, including drawings, as a file named `wozzeck-annotations.json`.

To load annotations from such a file, click the ↑ button and select the file. The annotations it contains are added to
your existing ones (nothing is replaced), and the "User" source filter is turned on so that they are visible.

### Architecture

The architecture panel shows the formal structure of the current scene. Its heading gives the name of the scene and its
overall form (for instance, "First Scene: Suite"), and below it is a list of the sections within that scene, as analyzed
by François-Hugues Leclair, each with its measure range. The section containing the current measure is highlighted, and the list updates automatically when
you move to a different scene. Click on a section to go to its first measure.

### Video Player

The video player shows a recording of a full performance of the opera, synchronized with the rest of the site. Use the
menu next to the panel title to choose between the available recordings, including the 1970 film and a performance
sung in English. While the video plays, the score, libretto, and other panels follow along; when you navigate to a new
position using any other panel, the video jumps to the corresponding moment in the recording. The video pauses when the
panel is closed, and catches up to the current position in the score when it is reopened.

### Libretto

The libretto panel displays the complete German text of the opera, including character names and stage directions. The
line currently being sung is highlighted, and the panel scrolls automatically to keep it in view. Click on a line of
text to go to the measure where it is sung.

### Full Score

The full score panel displays the Universal Edition orchestral score, showing the page that contains the current
measure. The current measure is highlighted; click on any other measure on the page to go to it. Hover over the score to
show the controls for moving to the previous or next page, and for entering fullscreen mode. In fullscreen mode, scroll
to zoom in and out, click and drag to move around the page, and press Escape or click outside the score to exit. Click
on the panel title to open the complete score as a PDF in a new tab.

Graphical annotations created in the annotation panel are drawn on top of the full score, on the page they belong to.

### PV Score

The PV score panel displays the piano-vocal reduction of the opera. It works in the same way as the full score panel:
the current measure is highlighted, other measures can be clicked to navigate to them, and the same page navigation and
fullscreen controls are available. Click on the panel title to open the piano-vocal score as a PDF.

### Garant Score

The Garant score panel displays Serge Garant's annotated copy of the piano-vocal score, which contains his analysis of
all of Act I and part of Act II. It works in the same way as the full score panel. Click on one of the Roman numerals
next to the panel title to open the PDF of the corresponding act.

### Garant Orchestral Score

The Garant orchestral score panel displays an orchestral score annotated by Marcelle Deschênes in connection with Serge
Garant's course. The annotated pages cover Act III, from measure 106 of Scene 2 to measure 374, near the beginning of
Scene 5, and are shown as two-page spreads. Outside of this range, the panel shows the cover of the score; when the panel
is opened at a point outside of this range, the site navigates to the nearest annotated measure. Otherwise, it works in
the same way as the full score panel. Click on the panel title to open the annotated score as a PDF.
