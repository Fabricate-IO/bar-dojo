// SVG implementation note: canvases are sized to 24pt x 24pt by default

import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

let IconTimeline = (props) => (
  <SvgIcon {...props}>
    <path d="M3,3.5c0-0.7-0.4-1.2-1-1.4V1c0-0.3-0.2-0.5-0.5-0.5S1,0.7,1,1v1.1C0.4,2.3,0,2.8,0,3.5s0.4,1.2,1,1.4v5.2
      c-0.6,0.2-1,0.8-1,1.4c0,0.7,0.4,1.2,1,1.4v5.2c-0.6,0.2-1,0.8-1,1.4s0.4,1.2,1,1.4V22c0,0.3,0.2,0.5,0.5,0.5
      C1.8,22.5,2,22.3,2,22v-1.1c0.6-0.2,1-0.8,1-1.4c0-0.7-0.4-1.2-1-1.4v-5.2c0.6-0.2,1-0.8,1-1.4c0-0.7-0.4-1.2-1-1.4V4.9
      C2.6,4.7,3,4.2,3,3.5z M23,1.5H8.5c0,0-0.7-0.1-0.9,0.1l-2,1.5c-0.2,0.2-0.2,0.5,0,0.7l2,1.5c0.2,0.2,0.9,0.2,0.9,0.2H23
      c0.6,0,1-0.4,1-1v-2C24,1.9,23.6,1.5,23,1.5z M23,9.5H8.5c0,0-0.7-0.1-0.9,0.1l-2,1.5c-0.2,0.2-0.2,0.5,0,0.7l2,1.5
      c0.2,0.2,0.9,0.2,0.9,0.2H23c0.6,0,1-0.4,1-1v-2C24,9.9,23.6,9.5,23,9.5z M23,17.5H8.5c0,0-0.7-0.1-0.9,0.1l-2,1.5
      c-0.2,0.2-0.2,0.5,0,0.7l2,1.5c0.2,0.2,0.9,0.2,0.9,0.2H23c0.6,0,1-0.4,1-1v-2C24,17.9,23.6,17.5,23,17.5z"/>
  </SvgIcon>
);
IconTimeline = pure(IconTimeline);
IconTimeline.displayName = 'IconTimeline';
IconTimeline.muiName = 'SvgIcon';

export default IconTimeline;
