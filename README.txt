HOW TO RUN THIS
================
Install the free "Live Server" extension in VS Code, then right-click
index.html and choose "Open with Live Server." This uses your
microphone (candles) and plays audio/video, so it needs to run from a
local server, not a plain double-clicked file.

You need an internet connection the first time it loads (fonts and
animation libraries load from the web).

Do not rename or move the css/, js/, or assets/ folders.


ASSETS YOU NEED TO ADD (all go in the "assets" folder, exact names)
=======================================================================
road.mp4            — night driving video, Act II
beach.mp4            — ocean video, reused across every beach scene
arrival-song.mp3    — starts playing the moment she reaches the table
ring.jpg              — the ring photo, shown inside the suitcase
key-video.mp4        — your video, plays after she "unlocks" the box

Nothing breaks if any of these are missing — everything has a
tasteful fallback so you can keep testing and add the real files
whenever they're ready.


HOW TO EDIT THE WORDS
=======================
Everything is in js/content.js, in plain English — her name, your
name, every line of dialogue, the menu, the letter, the gold pass
wording, the ring caption, the key inscription, the cake lines, and
the finale title. Just rewrite the text between the quotation marks.

The pacing is now reader-controlled — every line of dialogue waits
for a tap before advancing, so she can take her time reading instead
of anything rushing past her.


THE FULL STRUCTURE, ACT BY ACT
=================================
I    — Get Ready: a short, catchy opening line, then one button
II   — The Journey: road video, hers to read at her own pace
III  — Arrival: the table is set with both your real names, music
        starts, the waiter greets her
IV   — The Dinner: a proper seafood menu with descriptions, the
        waiter reacts personally to what she orders
V    — The Letter: a real envelope opens smoothly, her exact letter
        appears on a handwritten card with tulips underneath
VI   — The Suitcase: a real 3D case that opens on tap, containing the
        gold pass (which flips), a photo of the ring, and the key
VII  — The Locked Box: she uses the key, then your video plays
VIII — The Cake: a rotating 3D cake, 22 candles, blown out with her
        actual breath through the microphone
IX   — The Finale: fireworks, a field of tulips, and "HAPPIEST
        BIRTHDAY, MI AMOR"


SENDING IT TO HER
===================
Zip the whole "toti-birthday" folder and send the zip. She unzips it
and opens index.html the same way you did.
