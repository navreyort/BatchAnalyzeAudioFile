/*jshint esversion: 6 */

import fs from 'fs';
import path from 'path';
import AV from 'av';
import AudioExtractor from './AudioExtractorOffline';

export class BatchAnalyzeAudioFile {
  constructor(dir, features, normalize, output){
    this.dir = dir;
    this.features = features;
    this.output = output || 'analysis.json';
    this.numFiles = 0;
    this.count = 0;
    this.analysisResult = [];
    this.startTime = 0;
    this.normalize = normalize || false;
    this.batch();
  }

  batch(){
    console.log('\n\nAnalysis Begin:');
    var _this = this;
    fs.readdir(this.dir, (err,files)=>{
      _this.numFiles = files.length;
      for (var i=_this.numFiles-1; i>=0; i--) {
        if(path.extname(files[i]) === '.wav'){
          _this.analyze(_this.dir + files[i]);
        }
        else{
          _this.numFiles--;
        }
      }
    });
  }

  analyze(file){
    var _this = this;
    var asset = AV.Asset.fromFile(file);

    asset.decodeToBuffer((buffer)=>{
      console.log(file);

      var extractor = new AudioExtractor(buffer, _this.features, 512);
      extractor.cleanup();

      if(_this.normalize){
        extractor.normalize();
      }

      var means = {};
      for(let i=0;i<_this.features.length;i++){
        means[_this.features[i]] = extractor.getMean(_this.features[i]);
      }

      means.duration = asset.duration/1000;

      _this.analysisResult[file] = means;

      if(++_this.count >= _this.numFiles){
        _this.save();
      }
    });
  }

  save(){
    var keys = Object.keys(this.analysisResult);
    keys.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    var sorted = new Array(keys.length);
    for (let i=0; i<keys.length; i++) {
      sorted[i] = this.analysisResult[keys[i]];
      sorted[i].startTime = this.startTime;
      this.startTime += sorted[i].duration;
    }

    fs.writeFile(this.dir+this.output,JSON.stringify(sorted),function(err){
      if(err) return console.log(err);
      console.log('Analysis Done!');
    });
  }
}

export default BatchAnalyzeAudioFile;
