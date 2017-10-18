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
    base: '#282c34',
    sub: '#1b1b1b',
    link: '#2b6cc4',
    accent: '#2bc483',
    accentSub: '#ffffff'
  }
};

export default jss.createStyleSheet({
  '@global': {
    body: {
      background: vars.color.base
    },
    '#qC a, #qCo a': {
      color: vars.color.link
    },
    '#qC h1, #qCo h1': {
      // color: vars.color.accent
    },
    '#qC h2, #qCo h2': {
      borderLeft: `2px solid ${vars.color.accent}`
    },
    '#qC h3, #qCo h3': {
      borderLeft: `1px solid`
    },
    '#qC .code-frame, #qCo .code-frame': {
      background: '#282c34',
      color: '#9da5b4'
    },
    '#qC table, #qCo table': {
      padding: 0,
      border: `1px solid ${'#282c34'}`
    },
    '#qC thead, #qCo thead': {
      background: '#282c34',
      color: '#9ea6b3'
    },
    '#qC table th, $qC table td, #qCo table th, #qCo table td': {
      border: '1px solid #282c34'
    },
    ':root:root #qC hr, :root:root #qCo hr': {
      opacity: .15,
      border: 'none',
      borderBottom: '1px solid',
    }
  },
  body: {
    background: '#222',
    color: '#f8f8f8'
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
    background: '#000000',
  },
  placeholderText: {
    color: 'white',
  },
  placeholderIcon: {
    background: '#565656',
    border: `3px solid ${vars.color.accentSub}`,
    fill: '#fff !important',
  },
  headerTitle: {
    textAlign: 'center',
    padding: '.5em',
    color: '#ffffff',
  },
  headerButton: {
    color: '#ffffff'
  },
  streetPlusBox: {
    background: vars.color.base,
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
    border: '1px solid #444444',
    background: '#282c34',
    color: '#dcdcdc',
    
    '& .card__data': {
      color: 'rgba(255,255,255,.7)'
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
