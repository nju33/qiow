import {create} from 'jss';
import preset from 'jss-preset-default';

const jss = create();
jss.setup(preset());

export default jss.createStyleSheet({
  body: {
    background: '#222',
    color: '#f8f8f8'
  }
});
