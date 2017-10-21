import {create} from 'jss';
import preset from 'jss-preset-default';

const jss = create();
jss.setup(preset());

const vars = {
  color: {
    base: '#f222',
  }
};

export default jss.createStyleSheet({
  '@global': {
    body: {
      background: vars.color.base,
      color: '#ccc'
    },
  },
  placeholderText: {
    color: 'white',
  },
});
