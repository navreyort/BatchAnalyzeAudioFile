/*jshint esversion: 6 */

import BatchAnalyzeAudioFile from './BatchAnalyzeAudioFile';

var dir = '/Users/n4v/Desktop/constsnd/Individuals/l-Edited/';
var features = ['rms','mfcc'];
var normalize = false;
new BatchAnalyzeAudioFile(dir,features,normalize);
