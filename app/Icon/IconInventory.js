// SVG implementation note: canvases are sized to 24pt x 24pt by default

import React from 'react';
import pure from 'recompose/pure';
import SvgIcon from 'material-ui/SvgIcon';

let IconInventory = (props) => (
  <SvgIcon {...props}>
    <g>
      <path d="M20.4,24H3.6c-0.2,0-0.4-0.2-0.4-0.4V1.4C3.2,1.2,3.4,1,3.6,1h16.8c0.2,0,0.4,0.2,0.4,0.4v22.2C20.8,23.8,20.6,24,20.4,24z
         M4,23.2H20V1.8H4V23.2z"/>
    </g>
    <g>
      <rect x="9.2" width="5.7" height="2.9"/>
    </g>
    <g>
      <path d="M17.7,6.2H8.6c-0.2,0-0.4-0.2-0.4-0.4c0-0.2,0.2-0.4,0.4-0.4h9.1c0.2,0,0.4,0.2,0.4,0.4C18.1,6.1,17.9,6.2,17.7,6.2z"/>
    </g>
    <g>
      <circle cx="6.5" cy="5.8" r="0.6"/>
    </g>
    <g>
      <path d="M17.7,9.7H8.6c-0.2,0-0.4-0.2-0.4-0.4s0.2-0.4,0.4-0.4h9.1c0.2,0,0.4,0.2,0.4,0.4S17.9,9.7,17.7,9.7z"/>
    </g>
    <g>
      <circle cx="6.5" cy="9.3" r="0.6"/>
    </g>
    <g>
      <path d="M17.7,20H8.6c-0.2,0-0.4-0.2-0.4-0.4c0-0.2,0.2-0.4,0.4-0.4h9.1c0.2,0,0.4,0.2,0.4,0.4C18.1,19.8,17.9,20,17.7,20z"/>
    </g>
    <g>
      <circle cx="6.5" cy="19.6" r="0.6"/>
    </g>
    <g>
      <path d="M17.7,16.6H8.6c-0.2,0-0.4-0.2-0.4-0.4c0-0.2,0.2-0.4,0.4-0.4h9.1c0.2,0,0.4,0.2,0.4,0.4C18.1,16.4,17.9,16.6,17.7,16.6z"
        />
    </g>
    <g>
      <circle cx="6.5" cy="16.2" r="0.6"/>
    </g>
    <g>
      <path d="M17.7,13.1H8.6c-0.2,0-0.4-0.2-0.4-0.4c0-0.2,0.2-0.4,0.4-0.4h9.1c0.2,0,0.4,0.2,0.4,0.4C18.1,12.9,17.9,13.1,17.7,13.1z"
        />
    </g>
    <g>
      <circle cx="6.5" cy="12.7" r="0.6"/>
    </g>
  </SvgIcon>
);
IconInventory = pure(IconInventory);
IconInventory.displayName = 'IconInventory';
IconInventory.muiName = 'SvgIcon';

export default IconInventory;
