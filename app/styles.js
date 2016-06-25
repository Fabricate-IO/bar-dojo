// Global style references

import { // color options: http://www.material-ui.com/#/customization/colors
  grey50, // near-white, for text
  grey900, // near-black, for backgrounds
  cyan500, // appbar
} from 'material-ui/styles/colors';

module.exports = {
  backgroundColor: grey50,
  logo: {
    maxHeight: 42,
    width: 'auto',
    paddingTop: 12,
    paddingLeft: 12,
  },
  appbar: {
    backgroundColor: cyan500,
  },
  navlink: {
    color: grey50,
    textDecoration: 'none',
  },
  contentBox: {
    padding: '12px 24px',
  },
  textInput: {
    verticalAlign: 'bottom',
  },

  outOfStock: {
    opacity: 0.7,
  },
};