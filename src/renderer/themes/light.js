import {create} from 'jss';
import preset from 'jss-preset-default';

const jss = create();
jss.setup(preset());

const vars = {
  color: {
    base: '#f5f5f5', // culturedpearl
    sub: '#1b1b1b', // eerieblack
    link: '#2b6cc4', // denim
    accent: '#2bc483'
  }
}

export default jss.createStyleSheet({
  '@global': {
    body: {
      background: vars.color.base
    },
    '#qC a': {
      color: vars.color.link
    },
    '#qC h1': {
      // color: vars.color.accent
    },
    '#qC h2': {
      borderLeft: `2px solid ${vars.color.accent}`
    },
    '#qC h3': {
      borderLeft: `1px solid`
    },
    '#qC .code-frame': {
      background: '#282c34',
      color: '#9da5b4'
    },
    ':root:root #qC hr': {
      opacity: .15,
      border: 'none',
      borderBottom: '1px solid',
    }
  },
  body: {
  },
  title: {
    color: vars.color.accent
  },
  userBoard: {
    background: 'linear-gradient(-45deg, #dcdcdc, #cfcfcf)',
    borderRight: '1px solid #cfcfcf'
  },
  userBoardImg: {
    background: vars.color.base,
    border: `2px solid ${vars.color.accent}`
  },
  userBoardName: {
    background: vars.color.base,
    color: vars.color.sub
  },
  streetPlusBox: {
    background: vars.color.accent
  },
  streetPlusIcon: {
    '&&': {
      fill: vars.color.base,
    }
  },
  accentButton: {
    color: vars.color.accent
  },
  card: {
    border: '1px solid #dcdcdc',
    background: '#fefefe',

    '& .card__data': {
      color: 'rgba(0,0,0,.7)'
    }
  },
  loadingIcon: {
    fill: vars.color.accent
  }
});
