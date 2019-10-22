let elementGlobals = {};

elementGlobals['Background'] = {
  globals: {
    selector:
      '.box, .editor .top-boxes, .CodeMirror-gutter-wrapper, body.project .editor-pane, body.project .editor',
    prop: 'background'
  },
  fallback: {
    color: '#000000'
  }
};

elementGlobals['Cursor'] = {
  globals: {
    selector: '.CodeMirror-cursor',
    prop: 'border-left-color'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Default'] = {
  globals: {
    selector:
      '.CodeMirror pre, .box pre,.editor .top-boxes pre,.CodeMirror-gutter-wrapper pre',
    description: "when nothin' else applies"
  },
  fallback: {
    color: '#FFFFFF'
  }
};

elementGlobals['Keyword'] = {
  globals: {
    selector: '.cm-keyword',
    description: 'e.g. var, function'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Atom'] = {
  globals: {
    selector: '.cm-atom',
    description:
      'used for some CSS values and JS primitives (e.g. null, undefined)'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['HTML Atom'] = {
  globals: {
    selector: '.box-html .cm-atom',
    description: 'e.g. HTML entities'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Definition'] = {
  globals: {
    selector: '.cm-def',
    description: 'e.g. @include, var foo'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Variable'] = {
  globals: {
    selector: '.cm-variable',
    description: 'for already-defined variables'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Variable 2'] = {
  globals: {
    selector: '.cm-variable-2',
    description: 'e.g. markdown lists, JS args, SCSS variables'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Variable 3'] = {
  globals: {
    selector: '.cm-variable-3',
    description: 'used for CSS psuedo elements e.g. :before'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Header'] = {
  globals: {
    selector: '.cm-header',
    description: 'used for Markdown headers and maybe other stuff'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Number'] = {
  globals: {
    selector: '.cm-number'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Property'] = {
  globals: {
    selector: '.cm-property',
    description: 'CSS properties, JS object properties'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Attribute'] = {
  globals: {
    selector: '.cm-attribute',
    description: 'HTML attributes'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Builtin'] = {
  globals: {
    selector: '.cm-builtin',
    description: 'used for CSS ID selectors'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Qualifier'] = {
  globals: {
    selector: '.cm-qualifier',
    description: 'used for CSS class selectors'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Operator'] = {
  globals: {
    selector: '.cm-operator',
    description: 'e.g. =, +, -'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Meta'] = {
  globals: {
    selector: '.cm-meta',
    description: 'used for vendor prefixes'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['String Color'] = {
  globals: {
    selector: '.cm-string'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Secondary String'] = {
  globals: {
    selector: '.cm-string-2',
    description: 'some CSS values'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['HTML Tag'] = {
  globals: {
    selector: '.cm-tag',
    description: 'tags in HTML'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Matching Tag'] = {
  globals: {
    selector: '.CodeMirror-matchingtag',
    description: 'Indicator for matching HTML tags',
    prop: 'border-bottom-color'
  },
  fallback: {
    master: 'HTML Tag'
  }
};

elementGlobals['CSS Tag'] = {
  globals: {
    selector: '.box-css .cm-tag',
    description: 'element selectors in CSS'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Tag Bracket'] = {
  globals: {
    selector: '.cm-tag.cm-bracket',
    description: 'angle brackets in HTML'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Line Number'] = {
  globals: {
    selector: '.CodeMirror-linenumber'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Gutter Marker'] = {
  globals: {
    selector: '.CodeMirror-guttermarker-subtle',
    description: 'e.g. those toggle arrows next to line numbers'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Comment'] = {
  globals: {
    selector: '.cm-comment'
  },
  fallback: {
    master: 'Default'
  }
};

elementGlobals['Selected'] = {
  globals: {
    selector:
      '.cm-searching, .CodeMirror-focused .CodeMirror-selected, .CodeMirror-selected',
    description: 'used for highlighted text',
    prop: 'background-color'
  },
  fallback: {
    color: '#AAAAAA'
  }
};

export default elementGlobals;
