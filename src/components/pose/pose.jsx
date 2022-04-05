// from: https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/demos/live_video/index.html

import { useEffect } from 'react';
import './pose.css';
import poseTfjs from './pose-tfjs';
// import { CoPresent } from '@mui/icons-material';
export default function PoseTask() {
  useEffect(() => {
    const gui = poseTfjs();

    return () => {
      gui.then((val) => val.destroy());
    };
  }, []);
  return (
    <div className="Task-div">
      <div className="Spacing-div" />
      <div className="Pose-div">
        <div className="canvas-wrapper">
          <video className="video" id="video" playsInline></video>
          <canvas id="output"></canvas>
          {/* <video id="video" className="Hidden-video" playsInline></video> */}
        </div>
      </div>
      {/* <div className="Spacing-div" /> */}
      <div id="scatter-gl-container"></div>
    </div>
  );
}
