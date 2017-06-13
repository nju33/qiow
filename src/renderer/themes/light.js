import {create} from 'jss';
import preset from 'jss-preset-default';

const jss = create();
jss.setup(preset());

export default jss.createStyleSheet({
  body: {
    background: '#f8f8f8'
  }
});
