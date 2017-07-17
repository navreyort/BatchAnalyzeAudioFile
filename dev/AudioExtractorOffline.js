/*jshint esversion: 6 */

import Meyda from 'meyda';
import MathUtils from './MathUtils';

//XXX Assumes mono signal
//XXX Loudness does not work
export class AudioExtractorOffline {
  constructor(signal, features, chunkSize){
    this.signal = signal;
    this.features = features;
    this.numFeatures = features.length;
    Meyda.bufferSize = chunkSize;
    this.init();
    this.extract();
  }

  init(){
    this.featureSize = Math.ceil(this.signal.length / Meyda.bufferSize);
    this.extracted = {};
    for(var i=0;i<this.features.length;i++){
      if(this.features[i] !== 'mfcc'){
        this.extracted[this.features[i]] = new Float32Array(this.featureSize);
      }
      else{
        this.extracted[this.features[i]] = [];
        for(let j=0;j<13;j++){
          this.extracted[this.features[i]].push(new Float32Array(this.featureSize));
        }
      }
    }
  }

  extract(){
    for(var i=0;i<this.featureSize;i++){
      var subSignal;
      if(this.signal.length-(Meyda.bufferSize*i) < Meyda.bufferSize){
        subSignal = new Float32Array(Meyda.bufferSize);
        for(var k=0,len=this.signal.length-(Meyda.bufferSize*i);k<len;k++){
          subSignal[k] = this.signal[(Meyda.bufferSize*i)+k];
        }
      }
      else{
        subSignal = this.signal.subarray(Meyda.bufferSize*i,Meyda.bufferSize*i+Meyda.bufferSize);
      }

      var features = Meyda.extract(this.features, subSignal);
      for(let feature in features){
        if(feature !== 'mfcc'){
          this.extracted[feature][i] = features[feature];
        }
        else{
          for(let j=0;j<13;j++){
            this.extracted[feature][j][i] = features[feature][j];
          }
        }
      }
    }
  }

  normalize(){
    for(let feature in this.extracted){
      if(feature !== 'mfcc'){
        MathUtils.featureScaleNormalize(this.extracted[feature]);
      }
      else{
        for(let i=0;i<13;i++){
          MathUtils.featureScaleNormalize(this.extracted[feature][i]);
        }
      }
    }
  }

  getFeature(feature){
    return this.extracted[feature];
  }

  getFeatures(){
    return this.extracted;
  }

  getFeatureSize(){
    return this.featureSize;
  }

  getMean(feature){
    if(feature !== 'mfcc'){
      return MathUtils.mean(this.extracted[feature]);
    }
    else{
      var means = [];
      for(let i=0;i<13;i++){
        means.push(MathUtils.mean(this.extracted[feature][i]));
      }
      return means;
    }
  }

  truncateFirstValue(){
    for(let feature in this.extracted){
      if(feature !== 'mfcc'){
        this.extracted[feature] = this.extracted[feature].slice(1);
      }
      else{
        for(let i=0;i<13;i++){
          this.extracted[feature][i] = this.extracted[feature][i].slice(1);
        }
      }
    }
  }

  truncateLastValue(){
    for(let feature in this.extracted){
      if(feature !== 'mfcc'){
        this.extracted[feature] = this.extracted[feature].slice(0,this.extracted[feature].length-1);
      }
      else{
        for(let i=0;i<13;i++){
          this.extracted[feature][i] = this.extracted[feature][i].slice(0,this.extracted[feature][i].length-1);
        }
      }
    }
  }

  cleanup(){
    this.truncateFirstValue();
    this.truncateLastValue();

    var findNan = element => !isNaN(element);
    for(let feature in this.extracted){
      if(feature !== 'mfcc'){
        this.extracted[feature] = this.extracted[feature].filter(findNan);
      }
      else{
        for(let i=0;i<13;i++){
          this.extracted[feature][i] = this.extracted[feature][i].filter(findNan);
        }
      }
    }
  }
}

export default AudioExtractorOffline;
