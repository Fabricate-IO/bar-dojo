// Global style references

import { // color options: http://www.material-ui.com/#/customization/colors
  grey50, // near-white, for text
  grey500, // greyed-out / disabled
  grey900, // near-black, for backgrounds
  cyan500, // appbar
} from 'material-ui/styles/colors';

module.exports = {
// page
  backgroundColor: grey50,

// navigation
  logo: {
    maxHeight: 42,
    width: 'auto',
    paddingTop: 10,
    paddingLeft: 14,
    paddingBottom: 10,
  },
  appbar: {
    backgroundColor: cyan500,
  },
  navlink: {
    color: grey50,
    textDecoration: 'none',
  },

// layout
  contentBox: {
    padding: '12px 24px',
  },
  expanded: {
    padding: '10px',
  },
  floatLeft: {
    float: 'left',
    marginRight: '12px',
  },
  inlineSelect: {
    lineHeight: '48px',
    paddingTop: 0,
    paddingBottom: 0,
  },
  textInput: {
    verticalAlign: 'bottom',
  },

// color / highlight
  outOfStock: {
    color: grey500,
  },
  faded: {
    color: grey500,
  },
};
