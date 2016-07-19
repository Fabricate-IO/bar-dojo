// SVG implementation note: canvases are sized to 24pt x 24pt by default

import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

let IconMixed = (props) => (
  <SvgIcon {...props}>
    <path d="M13.6,21.1L13.6,21.1c-0.9-0.5-1.1-3.7-1.1-3.7v-6L19,0.8C18.7,0,12,0,12,0h0c0,0-6.7,0-7,0.8l6.5,10.6v6
  c0,0-0.2,3.2-1.1,3.7h0c-2.1,0.2-3.6,0.7-3.6,1.4c0,0.8,2.3,1.5,5.2,1.5s5.2-0.7,5.2-1.5C17.2,21.9,15.6,21.3,13.6,21.1z"/>
  </SvgIcon>
);
IconMixed = pure(IconMixed);
IconMixed.displayName = 'IconMixed';
IconMixed.muiName = 'SvgIcon';

export default IconMixed;
