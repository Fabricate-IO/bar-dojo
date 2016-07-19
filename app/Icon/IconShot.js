// SVG implementation note: canvases are sized to 24pt x 24pt by default

import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

let IconShot = (props) => (
  <SvgIcon {...props}>
    <path d="M18.9,1.2C18.9,0.5,15.8,0,12,0S5.1,0.5,5.1,1.2c0,0,0,0,0,0.1l2.1,13.9c0,0,0.3,3.1,0.3,4.1c0,1,0,3.5,0,3.5l0,0
  c0,0.7,2,1.2,4.5,1.2s4.5-0.6,4.5-1.2l0,0c0,0,0-2.5,0-3.5c0-1,0.3-4.1,0.3-4.1L18.9,1.2z"/>
  </SvgIcon>
);
IconShot = pure(IconShot);
IconShot.displayName = 'IconShot';
IconShot.muiName = 'SvgIcon';

export default IconShot;
