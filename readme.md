# BatchAnalyzeAudioFile
A program to batch analyze audio file to extract time-domain, spectrum, and perceptual audio features. This program is based on [aurora.js](https://github.com/audiocogs/aurora.js) and [meyda](https://github.com/meyda/meyda).

## Installation
Install nodejs and npm if you do not have them yet. Then run `npm install` at the root level of this project folder.

## Sound file

Currently, this project only supports wave file format. The file extension specifically needs to be `.wav`. Place all sound files you'd like to analyze in a single directory. Change the directory name in dev/index.js. The program will spit out an analysis result in `analyze.json` file within the same directory. The analysis result is in an alphabetical order of the sound files.

## Run
Test the app using:

    npm test

## TODO
* Support more sound file formats
* Support loudness extraction

## License
MIT
