// SVG implementation note: canvases are sized to 24pt x 24pt by default

import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

let IconWine = (props) => (
  <SvgIcon {...props}>
    <path d="M11.9,24c-4.4-0.1-4.3-1.3-4.3-1.3c0-1.2,3.7-1.4,3.7-1.4c0.6-0.5,0.4-3.2,0.4-3.2c0-6.5-0.8-6.8-0.8-6.8
  c-4.3-2.5-3.4-6-3.4-6l0.9-4.9C8.8,0,12,0,12,0H12c0,0,3.2,0,3.5,0.4l0.9,4.9c0,0,1,3.5-3.4,6c0,0-0.8,0.3-0.8,6.8
  c0,0-0.1,2.7,0.4,3.2c0,0,3.7,0.2,3.7,1.4c0,0,0.1,1.3-4.3,1.3H11.9z"/>
  </SvgIcon>
);
IconWine = pure(IconWine);
IconWine.displayName = 'IconWine';
IconWine.muiName = 'SvgIcon';

export default IconWine;
