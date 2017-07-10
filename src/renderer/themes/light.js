import {create} from 'jss';
import preset from 'jss-preset-default';

const jss = create();
jss.setup(preset());

/**
 * easeOutCubic
 */
const easing = 'cubic-bezier(0.215, 0.61, 0.355, 1)';

/**
 * @prop {string} base culturedpearl
 * @prop {string} sub eerieblack
 * @prop {string} link denim
 */
const vars = {
  color: {
    base: '#f5f5f5',
    sub: '#1b1b1b',
    link: '#2b6cc4',
    accent: '#2bc483',
    accentSub: '#229a67'
  }
};

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
    '#qC table': {
      padding: 0,
      border: `1px solid ${'#282c34'}`
    },
    '#qC thead': {
      background: '#282c34',
      color: '#9ea6b3'
    },
    '#qC table th, $qC table td': {
      border: '1px solid #282c34'
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
  separator: {
    // background: vars.color.accent,
    // border: `1px dotted #565656`
    background: '#565656',
    border: `1px dotted ${vars.color.accent}`
  },
  streetPlusBox: {
    background: '#565656',
    // background: vars.color.accent,
    borderRight: `3px solid ${vars.color.accentSub}`
  },
  streetPlusLogo: {
    background: '#565656'
  },
  streetPlusIcon: {
    '&&': {
      fill: vars.color.base,
    }
  },
  input: {
    borderRadius: '2px',
    border: '1px solid #dcdcdc',
    transition: `.2s ${easing}`,
    '&:focus': {
      border: `1px solid ${vars.color.accent}`,
      boxShadow: `0 0 3px 0 ${vars.color.accent}`
    }
  },
  accentButton: {
    borderRadius: '2px',
    width: '31%',
    color: vars.color.base,
    background: vars.color.accent,
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    transition: `.2s ${easing}`,
    '&:hover': {
      background: vars.color.accentSub
    }
  },
  card: {
    border: '1px solid #565656',
    background: '#fefefe',

    '& .card__data': {
      color: 'rgba(0,0,0,.7)'
    }
  },
  loadingIcon: {
    fill: vars.color.accent
  },
  breadclumbItemFirst: {
    color: vars.color.accent
  },
  qiitaActionButton: {
    border: `2px solid ${'#565656'}`,
    boxSizing: 'border-box',
    transition: `.2s ${easing}`,
    transform: 'scale(0.7)',
    transformOrigin: 'center center',
    background: '#b39f29',

    '&:hover': {
      transform: 'scale(1)',
      background: vars.color.accent
    },

    '& svg': {
      fill: '#fff'
    }
  }
});
