// SVG implementation note: canvases are sized to 24pt x 24pt by default

import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

let IconAnalytics = (props) => (
  <SvgIcon {...props}>
    <rect x="13.7" y="13.2" width="2.8" height="6.6"/>
    <rect x="8.4" y="8.3" width="2.8" height="11.5"/>
    <rect x="3" y="15.2" width="2.8" height="4.6"/>
    <rect x="19.1" y="4.5" width="2.8" height="15.4"/>
    <polygon points="24.3,22 0.3,22 0.3,1.7 1.3,1.7 1.3,20.9 24.3,20.9 "/>
  </SvgIcon>
);
IconAnalytics = pure(IconAnalytics);
IconAnalytics.displayName = 'IconAnalytics';
IconAnalytics.muiName = 'SvgIcon';

export default IconAnalytics;
