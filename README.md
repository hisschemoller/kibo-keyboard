# Kibo Keyboard

A musical web app to play notes with delay effect.

Demo: https://hisschemoller.github.io/kibo-keyboard/<br>
<br>
![Kibo Keyboard](assets/img/kibo-keyboard.gif 'Kibo Keyboard')

Kibo Keyboard is a simple melodic music keyboard. Each time you play a note a small ball is launched from the bottom of the screen. The ball then bounces around the screen. Whenever it bounces off another object it again plays its sound. This way the bouncing balls create a random delay effect.

The harder you play the note (the higher the MIDI velocity) the higher the octave of the sound.

## Kodaly Kibo

![Kodaly Kibo](assets/img/kibo-bb-prospettiva.png 'Kodaly Kibo')

This app is especially made to work with the [Kodaly Kibo](https://www.kodaly.app/). The Kibo is a MIDI controller with eight wooden shapes that can be played like drum pads or piano keys. MIDI transmits wireless over Bluetooth LE or over USB cable.

## Kibo MIDI note pitches

When tapped the Kibo's eight pads send MIDI notes in default pitches. The app is set up to react to these pitches. They are 60, 62, 64, 65, 67, 69, 71 and 72. If you want to trigger the app with a different MIDI controller, be aware that it will only react to these pitches.

You will notice that the harder you hit a note, the higher it sounds. This is because MIDI velocity is used to determine the note's octave. The harder you hit, the higher the octave. On screen higher octaves are visible as smaller balls.

## App settings

![Settings panel](assets/img/kibo-keyboard-settings.gif 'Settings panel')

The settings panel shows when the app starts or when you click the cogwheel icon in the top right of the screen.

It has two settings:

1. Bluetooth - Click 'Connect' to connect to a Bluetooth LE device that transmits MIDI over Bluetooth.
2. MIDI - Select a MIDI input from the dropdown.

## Supported browsers

Chrome is currently the only browser that can run the app. The desktop as well as the mobile Android version.

Browsers have to implement the Javascript Web Bluetooth or Web MIDI API to run the app. Because these are required to connect through MIDI or Bluetooth.
