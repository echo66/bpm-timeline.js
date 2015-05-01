# bpm-timeline.js

A class that provides a similar way to schedule beat period changes like Web Audio API AudioParam but, in order to convert between Time (seconds) and Beat, we need to calculate the integrals and inverse of the integrals of the automation functions.
