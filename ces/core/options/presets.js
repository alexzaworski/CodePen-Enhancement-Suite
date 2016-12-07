// jscs:disable requireDotNotation
/* jshint sub: true */
var presets = (function() {
  var presets = {};
  var elementGlobals = [
  {
    prettyName: "Background",
    selector: ".box,.editor .top-boxes,.CodeMirror-gutter-wrapper",
    prop: "background"
  },
  {
    prettyName: "Cursor",
    selector: ".CodeMirror-cursor",
    prop: "border-left-color",
  },
  {
    prettyName: "Default",
    selector: ".box pre,.editor .top-boxes pre,.CodeMirror-gutter-wrapper pre",
    description: "when nothin' else applies",
    color: "#E6E6E6",
  },
  {
    prettyName: "Keyword",
    selector: ".cm-keyword",
    description: "e.g. var, function"
  },
  {
    prettyName: "Atom",
    selector: ".cm-atom",
    description: "used for some CSS values and JS primitives (e.g. null, undefined)"
  },
  {
    prettyName: "HTML Atom",
    selector: ".box-html .cm-atom",
    description: "e.g. HTML entities"
  },
  {
    prettyName: "Definition",
    selector: ".cm-def",
    description: "e.g. @include, var foo"
  },
  {
    prettyName: "Variable",
    selector: ".cm-variable",
    description: "for already-defined variables"
  },
  {
    prettyName: "Variable 2",
    selector: ".cm-variable-2",
    description: "e.g. markdown lists, JS args, SCSS variables"
  },
  {
    prettyName: "Variable 3",
    selector: ".cm-variable-3",
    description: "used for CSS psuedo elements e.g. :before"
  },
  {
    prettyName: "Header",
    selector: ".cm-header",
    description: "used for Markdown headers and maybe other stuff"
  },
  {
    prettyName: "Number",
    selector: ".cm-number",
  },
  {
    prettyName: "Property",
    selector: ".cm-property",
    description: "CSS properties, JS object properties"
  },
  {
    prettyName: "Attribute",
    selector: ".cm-attribute",
    description: "HTML attributes"
  },
  {
    prettyName: "Builtin",
    selector: ".cm-builtin",
    description: "used for CSS ID selectors"
  },
  {
    prettyName: "Qualifier",
    selector: ".cm-qualifier",
    description: "used for CSS class selectors"
  },
  {
    prettyName: "Operator",
    selector: ".cm-operator",
    description: "e.g. =, +, -"
  },
  {
    prettyName: "Meta",
    selector: ".cm-meta",
    description: "used for vendor prefixes"
  },
  {
    prettyName: "String Color",
    selector: ".cm-string",
  },
  {
    prettyName: "Secondary String",
    selector: ".cm-string-2",
    description: "some CSS values"
  },
  {
    prettyName: "HTML Tag",
    selector: ".cm-tag",
    description: "tags in HTML"
  },
  {
    prettyName: "CSS Tag",
    selector: ".box-css .cm-tag",
    description: "element selectors in CSS"
  },
  {
    prettyName: "Tag Bracket",
    selector: ".cm-tag.cm-bracket",
    description: "angle brackets in HTML"
  },
  {
    prettyName: "Line Number",
    selector: ".CodeMirror-linenumber",
  },
  {
    prettyName: "Gutter Marker",
    selector: ".CodeMirror-guttermarker-subtle",
    description: "e.g. those toggle arrows next to line numbers",
  },
  {
    prettyName: "Comment",
    selector: ".cm-comment",
  },
  {
    prettyName: "Selected",
    selector: ".cm-searching, .CodeMirror-focused .CodeMirror-selected, .CodeMirror-selected",
    description: "used for highlighted text",
    prop: "background-color",
  }
  ];

  presets["Monokai"] = {
    light: false,
    elements: [
    {
      prettyName: "Background",
      color: "#272825",
    },
    {
      prettyName: "Cursor",
      color: "#ffffff"
    },
    {
      prettyName: "Default",
      color: "#ffffff",
    },
    {
      prettyName: "Keyword",
      color: "#FA2D7D"
    },
    {
      prettyName: "Atom",
      color: "#ae81ff"
    },
    {
      prettyName: "HTML Atom",
      master: "atom",
    },
    {
      prettyName: "Definition",
      color: "#F79900"
    },
    {
      prettyName: "Variable",
      color: "#71D7D0"
    },
    {
      prettyName: "Variable 2",
      color: "#AE81FF"
    },
    {
      prettyName: "Variable 3",
      color: "#a6e22e"
    },
    {
      prettyName: "Header",
      color: "#FA2D7D"
    },
    {
      prettyName: "Number",
      color: "#B78CFF"
    },
    {
      prettyName: "Property",
      color: "#71D7D0"
    },
    {
      prettyName: "Attribute",
      color: "#a6e22e"
    },
    {
      prettyName: "Builtin",
      master: "attribute",
    },
    {
      prettyName: "Qualifier",
      master: "attribute",
    },
    {
      prettyName: "Operator",
      color: "#FA2D7D"
    },
    {
      prettyName: "Meta",
      color: "#FA2D7D"
    },
    {
      prettyName: "String Color",
      color: "#E9E07F"
    },
    {
      prettyName: "Secondary String",
      color: "#E9E07F"
    },
    {
      prettyName: "HTML Tag",
      color: "#FA2D7D"
    },
    {
      prettyName: "CSS Tag",
      color: "#f92672"
    },
    {
      prettyName: "Tag Bracket",
      color: "#ffffff"
    },
    {
      prettyName: "Line Number",
      color: "#575344"
    },
    {
      prettyName: "Gutter Marker",
      master: "line_number"
    },
    {
      prettyName: "Comment",
      master: "line_number"
    },
    {
      prettyName: "Selected",
      color: "#414141"
    }
    ]
  };

  presets["Twilight"] = {
    light: false,
    elements: [
    {
      prettyName: "Background",
      color: "#1d1f20"
    },
    {
      prettyName: "Cursor",
      color: "#ffffff"
    },
    {
      prettyName: "Default",
      color: "#ffffff"
    },
    {
      prettyName: "Keyword",
      color: "#ddca7e"
    },
    {
      prettyName: "Atom",
      color: "#ddca7e"
    },
    {
      prettyName: "HTML Atom",
      color: "#96b38a"
    },
    {
      prettyName: "Definition",
      color: "#809bbd"
    },
    {
      prettyName: "Variable",
      color: "#ddca7e"
    },
    {
      prettyName: "Variable 2",
      color: "#809bbd"
    },
    {
      prettyName: "Variable 3",
      master: "default",
    },
    {
      prettyName: "Header",
      color: "#FF6400"
    },
    {
      prettyName: "Number",
      color: "#d0782a"
    },
    {
      prettyName: "Property",
      color: "#9a8297"
    },
    {
      prettyName: "Attribute",
      color: "#ddca7e"
    },
    {
      prettyName: "Builtin",
      master: "attribute",
    },
    {
      prettyName: "Qualifier",
      master: "attribute",
    },
    {
      prettyName: "Operator",
      color: "#cccccc"
    },
    {
      prettyName: "Meta",
      color: "#9a8297"
    },
    {
      prettyName: "String Color",
      color: "#96b38a"
    },
    {
      prettyName: "Secondary String",
      color: "#FFFFFF"
    },
    {
      prettyName: "HTML Tag",
      color: "#A7925A"
    },
    {
      prettyName: "CSS Tag",
      color: "#ddca7e"
    },
    {
      prettyName: "Tag Bracket",
      master: "html_tag",
    },
    {
      prettyName: "Line Number",
      color: "#343434"
    },
    {
      prettyName: "Gutter Marker",
      master: "line_number"
    },
    {
      prettyName: "Comment",
      color: "#666666"
    },
    {
      prettyName: "Selected",
      color: "#35383A"
    }
    ]
  };

  presets["Solarized Dark"] = {
    light: false,
    elements: [
    {
      prettyName: "Background",
      color: "#1a414a"
    },
    {
      prettyName: "Cursor",
      color: "#ffffff"
    },
    {
      prettyName: "Default",
      color: "#839496"
    },
    {
      prettyName: "Keyword",
      color: "#839496"
    },
    {
      prettyName: "Atom",
      color: "#cb4b16"
    },
    {
      prettyName: "HTML Atom",
      color: "#7f9009"
    },
    {
      prettyName: "Definition",
      color: "#7f9009"
    },
    {
      prettyName: "Variable",
      color: "#1b89d4"
    },
    {
      prettyName: "Variable 2",
      color: "#1b89d4"
    },
    {
      prettyName: "Variable 3",
      master: "default",
    },
    {
      prettyName: "Header",
      color: "#fff9b9"
    },
    {
      prettyName: "Number",
      color: "#1f8261"
    },
    {
      prettyName: "Property",
      color: "#1b89d4"
    },
    {
      prettyName: "Attribute",
      color: "#839496"
    },
    {
      prettyName: "Builtin",
      color: "#cb4b16"

    },
    {
      prettyName: "Qualifier",
      color: "#cb4b16"

    },
    {
      prettyName: "Operator",
      color: "#839496"
    },
    {
      prettyName: "Meta",
      color: "#1b89d4"
    },
    {
      prettyName: "String Color",
      color: "#7f9009"
    },
    {
      prettyName: "Secondary String",
      color: "#1f8261"
    },
    {
      prettyName: "HTML Tag",
      color: "#1b89d4"
    },
    {
      prettyName: "CSS Tag",
      color: "#cb4b16"

    },
    {
      prettyName: "Tag Bracket",
      master: "html_tag",
    },
    {
      prettyName: "Line Number",
      color: "#999999"
    },
    {
      prettyName: "Gutter Marker",
      master: "line_number"
    },
    {
      prettyName: "Comment",
      color: "#365e68"
    },
    {
      prettyName: "Selected",
      color: "#2B5660"
    }
    ]
  };

  presets["Tomorrow Night"] = {
    light: false,
    elements: [
    {
      prettyName: "Background",
      color: "#1d1f20"
    },
    {
      prettyName: "Cursor",
      color: "#000000"
    },
    {
      prettyName: "Default",
      color: "#c3c6c4"
    },
    {
      prettyName: "Keyword",
      color: "#efc371"
    },
    {
      prettyName: "Atom",
      color: "#efc371"
    },
    {
      prettyName: "HTML Atom",
      color: "#b5bc67"
    },
    {
      prettyName: "Definition",
      color: "#efc371"
    },
    {
      prettyName: "Variable",
      color: "#efc371"
    },
    {
      prettyName: "Variable 2",
      color: "#ae94c0"
    },
    {
      prettyName: "Variable 3",
      master: "default",
    },
    {
      prettyName: "Header",
      color: "#dd925f"
    },
    {
      prettyName: "Number",
      color: "#dd925f"
    },
    {
      prettyName: "Property",
      color: "#ae94c0"
    },
    {
      prettyName: "Attribute",
      color: "#c3c6c4"
    },
    {
      prettyName: "Builtin",
      color: "#efc371"

    },
    {
      prettyName: "Qualifier",
      color: "#efc371"

    },
    {
      prettyName: "Operator",
      color: "#c3c6c4"
    },
    {
      prettyName: "Meta",
      color: "#b5bc67"
    },
    {
      prettyName: "String Color",
      color: "#b5bc67"
    },
    {
      prettyName: "Secondary String",
      color: "#FFFFFF"
    },
    {
      prettyName: "HTML Tag",
      color: "#efc371"
    },
    {
      prettyName: "CSS Tag",
      color: "#efc371"

    },
    {
      prettyName: "Tag Bracket",
      master: "html_tag",
    },
    {
      prettyName: "Line Number",
      color: "#444444"
    },
    {
      prettyName: "Gutter Marker",
      master: "line_number"
    },
    {
      prettyName: "Comment",
      color: "#666666"
    },
    {
      prettyName: "Selected",
      color: "#35383A"
    }
    ]
  };

  presets["Oceanic Dark"] = {
    light: false,
    elements: [
    {
      prettyName: "Background",
      color: "#1B2B34"
    },
    {
      prettyName: "Cursor",
      color: "#FFFFFF"
    },
    {
      prettyName: "Default",
      color: "#CDD3DE"
    },
    {
      prettyName: "Keyword",
      color: "#EC5f67"
    },
    {
      prettyName: "Atom",
      color: "#C594C5"
    },
    {
      prettyName: "HTML Atom",
      master: "atom",
    },
    {
      prettyName: "Definition",
      color: "#F99157"
    },
    {
      prettyName: "Variable",
      color: "#99C794"
    },
    {
      prettyName: "Variable 2",
      color: "#6699CC"
    },
    {
      prettyName: "Variable 3",
      master: "default",
    },
    {
      prettyName: "Header",
      master: "default",
    },
    {
      prettyName: "Number",
      master: "default",
    },
    {
      prettyName: "Property",
      color: "#99C794"
    },
    {
      prettyName: "Attribute",
      color: "#99C794"
    },
    {
      prettyName: "Builtin",
      master: "default",
    },
    {
      prettyName: "Qualifier",
      master: "default",
    },
    {
      prettyName: "Operator",
      master: "default",
    },
    {
      prettyName: "Meta",
      master: "default",
    },
    {
      prettyName: "String Color",
      color: "#FAC863"
    },
    {
      prettyName: "Secondary String",
      master: "string_color"
    },
    {
      prettyName: "HTML Tag",
      color: "#EC5f67"
    },
    {
      prettyName: "CSS Tag",
      master: "html_tag",
    },
    {
      prettyName: "Tag Bracket",
      master: "html_tag",
    },
    {
      prettyName: "Line Number",
      color: "#5D5D5D"
    },
    {
      prettyName: "Gutter Marker",
      master: "line_number"
    },
    {
      prettyName: "Comment",
      color: "#65737e"
    },
    {
      prettyName: "Selected",
      color: "#263844"
    }
    ]
  };

  presets["Panda"] = {
    light: false,
    elements: [
    {
      prettyName: "Background",
      color: "#292A2B"
    },
    {
      prettyName: "Cursor",
      color: "#ffffff"
    },
    {
      prettyName: "Default",
      color: "#E6E6E6"
    },
    {
      prettyName: "Keyword",
      color: "#FF75B5"
    },
    {
      prettyName: "Atom",
      color: "#ff2c6d"
    },
    {
      prettyName: "HTML Atom",
      master: "atom",
    },
    {
      prettyName: "Definition",
      color: "#e6e6e6"
    },
    {
      prettyName: "Variable",
      color: "#ffb86c"
    },
    {
      prettyName: "Variable 2",
      color: "#ff9ac1"
    },
    {
      prettyName: "Variable 3",
      color: "#ff9ac1"
    },
    {
      prettyName: "Header",
      master: "default",
    },
    {
      prettyName: "Number",
      color: "#FFB86C"
    },
    {
      prettyName: "Property",
      color: "#f3f3f3"
    },
    {
      prettyName: "Attribute",
      color: "#ffb86c"
    },
    {
      prettyName: "Builtin",
      master: "default",
    },
    {
      prettyName: "Qualifier",
      master: "default",
    },
    {
      prettyName: "Operator",
      color: "#f3f3f3"
    },
    {
      prettyName: "Meta",
      color: "#b084eb"
    },
    {
      prettyName: "String Color",
      color: "#19F9D8"
    },
    {
      prettyName: "Secondary String",
      color: "#FFB86C"
    },
    {
      prettyName: "HTML Tag",
      color: "#ff2c6d"
    },
    {
      prettyName: "CSS Tag",
      master: "html_tag"
    },
    {
      prettyName: "Tag Bracket",
      master: "html_tag",
    },
    {
      prettyName: "Line Number",
      color: "#949496"
    },
    {
      prettyName: "Gutter Marker",
      master: "line_number"
    },
    {
      prettyName: "Comment",
      color: "#676B79"
    },
    {
      prettyName: "Selected",
      color: "#464B4E"
    }
    ]
  };

  presets["DuoTone Dark"] = {
    light: false,
    elements: [
    {
      prettyName: "Background",
      color: "#2a2734"
    },
    {
      prettyName: "Cursor",
      color: "#ffffff"
    },
    {
      prettyName: "Default",
      color: "#6c6783"
    },
    {
      prettyName: "Keyword",
      color: "#ffcc99"
    },
    {
      prettyName: "Atom",
      master: "keyword"
    },
    {
      prettyName: "HTML Atom",
      master: "atom",
    },
    {
      prettyName: "Definition",
      color: "#eeebff"
    },
    {
      prettyName: "Variable",
      master: "keyword"
    },
    {
      prettyName: "Variable 2",
      color: "#6a51e6"
    },
    {
      prettyName: "Variable 3",
      master: "variable_2"
    },
    {
      prettyName: "Header",
      color: "#eeebff",
    },
    {
      prettyName: "Number",
      master: "keyword"
    },
    {
      prettyName: "Property",
      color: "#9b87fd"
    },
    {
      prettyName: "Attribute",
      master: "keyword"
    },
    {
      prettyName: "Builtin",
      master: "definition",
    },
    {
      prettyName: "Qualifier",
      master: "definition",
    },
    {
      prettyName: "Operator",
      color: "#ffa852"
    },
    {
      prettyName: "Meta",
      master: "default"
    },
    {
      prettyName: "String Color",
      color: "#ffba76"
    },
    {
      prettyName: "Secondary String",
      master: "variable_2"
    },
    {
      prettyName: "HTML Tag",
      master: "definition"
    },
    {
      prettyName: "CSS Tag",
      master: "html_tag"
    },
    {
      prettyName: "Tag Bracket",
      master: "html_tag",
    },
    {
      prettyName: "Line Number",
      color: "#545167"
    },
    {
      prettyName: "Gutter Marker",
      master: "line_number"
    },
    {
      prettyName: "Comment",
      color: "#6c6783"
    },
    {
      prettyName: "Selected",
      color: "#393649"
    }
    ]
  };

  presets["Classic"] = {
    light: true,
    elements: [
    {
      prettyName: "Background",
      color: "#FFFFFF"
    },
    {
      prettyName: "Cursor",
      color: "#000000"
    },
    {
      prettyName: "Default",
      color: "#999999"
    },
    {
      prettyName: "Keyword",
      color: "#221199"
    },
    {
      prettyName: "Atom",
      master: "keyword"
    },
    {
      prettyName: "HTML Atom",
      color: "#aa1111",
    },
    {
      prettyName: "Definition",
      color: "#770088"
    },
    {
      prettyName: "Variable",
      master: "keyword"
    },
    {
      prettyName: "Variable 2",
      color: "#000000"
    },
    {
      prettyName: "Variable 3",
      master: "variable"
    },
    {
      prettyName: "Header",
      color: "#aa1111",
    },
    {
      prettyName: "Number",
      color: "#116644"
    },
    {
      prettyName: "Property",
      color: "#221199"
    },
    {
      prettyName: "Attribute",
      color: "#555555"
    },
    {
      prettyName: "Builtin",
      color: "#221199",
    },
    {
      prettyName: "Qualifier",
      color: "#221199",
    },
    {
      prettyName: "Operator",
      color: "#000000"
    },
    {
      prettyName: "Meta",
      color: "#221199"
    },
    {
      prettyName: "String Color",
      color: "#aa1111"
    },
    {
      prettyName: "Secondary String",
      master: "string"
    },
    {
      prettyName: "HTML Tag",
      color: "#221199"
    },
    {
      prettyName: "CSS Tag",
      master: "html_tag"
    },
    {
      prettyName: "Tag Bracket",
      master: "html_tag",
    },
    {
      prettyName: "Line Number",
      color: "#cccccc"
    },
    {
      prettyName: "Gutter Marker",
      master: "line_number"
    },
    {
      prettyName: "Comment",
      color: "#cccccc"
    },
    {
      prettyName: "Selected",
      color: "#EDF0F0"
    }
    ]
  };

  presets["Solarized Light"] = {
    light: true,
    elements: [
    {
      prettyName: "Background",
      color: "#fdf6e3"
    },
    {
      prettyName: "Cursor",
      color: "#000000"
    },
    {
      prettyName: "Default",
      color: "#657b83"
    },
    {
      prettyName: "Keyword",
      color: "#b58900"
    },
    {
      prettyName: "Atom",
      color: "#cb4b16"
    },
    {
      prettyName: "HTML Atom",
      color: "#2aa198",
    },
    {
      prettyName: "Definition",
      color: "#268bd2"
    },
    {
      prettyName: "Variable",
      color: "#657b83"
    },
    {
      prettyName: "Variable 2",
      color: "#6c71c4"
    },
    {
      prettyName: "Variable 3",
      master: "variable"
    },
    {
      prettyName: "Header",
      color: "#000000",
    },
    {
      prettyName: "Number",
      color: "#b58900"
    },
    {
      prettyName: "Property",
      color: "#268bd2"
    },
    {
      prettyName: "Attribute",
      color: "#657b83"
    },
    {
      prettyName: "Builtin",
      color: "#cb4b16",
    },
    {
      prettyName: "Qualifier",
      color: "#cb4b16",
    },
    {
      prettyName: "Operator",
      color: "#93a1a1"
    },
    {
      prettyName: "Meta",
      color: "#2aa198"
    },
    {
      prettyName: "String Color",
      color: "#6c71c4"
    },
    {
      prettyName: "Secondary String",
      color: "#2aa198"
    },
    {
      prettyName: "HTML Tag",
      color: "#2aa198"
    },
    {
      prettyName: "CSS Tag",
      color: "#cb4b16"
    },
    {
      prettyName: "Tag Bracket",
      master: "html_tag",
    },
    {
      prettyName: "Line Number",
      color: "#cccccc"
    },
    {
      prettyName: "Gutter Marker",
      master: "line_number"
    },
    {
      prettyName: "Comment",
      color: "#93a1a1"
    },
    {
      prettyName: "Selected",
      color: "#F1EAD8"
    }
    ]
  };

  presets["XQ Light"] = {
    light: true,
    elements: [
    {
      prettyName: "Background",
      color: "#FFFFFF"
    },
    {
      prettyName: "Cursor",
      color: "#000000"
    },
    {
      prettyName: "Default",
      color: "#999999"
    },
    {
      prettyName: "Keyword",
      color: "#5A5CAD"
    },
    {
      prettyName: "Atom",
      color: "#6C8CD5"
    },
    {
      prettyName: "HTML Atom",
      master: "atom",
    },
    {
      prettyName: "Definition",
      color: "#000000"
    },
    {
      prettyName: "Variable",
      color: "#000000"
    },
    {
      prettyName: "Variable 2",
      master: "variable"
    },
    {
      prettyName: "Variable 3",
      master: "variable"
    },
    {
      prettyName: "Header",
      master: "default",
    },
    {
      prettyName: "Number",
      color: "#116644"
    },
    {
      prettyName: "Property",
      color: "#999999"
    },
    {
      prettyName: "Attribute",
      color: "#7F007F"
    },
    {
      prettyName: "Builtin",
      color: "#7EA656",
    },
    {
      prettyName: "Qualifier",
      color: "#808080",
    },
    {
      prettyName: "Operator",
      color: "#5A5CAD"
    },
    {
      prettyName: "Meta",
      color: "#0080FF"
    },
    {
      prettyName: "String Color",
      color: "#ff0000"
    },
    {
      prettyName: "Secondary String",
      master: "string"
    },
    {
      prettyName: "HTML Tag",
      color: "#3F7F7F"
    },
    {
      prettyName: "CSS Tag",
      master: "html_tag"
    },
    {
      prettyName: "Tag Bracket",
      master: "html_tag",
    },
    {
      prettyName: "Line Number",
      color: "#cccccc"
    },
    {
      prettyName: "Gutter Marker",
      master: "line_number"
    },
    {
      prettyName: "Comment",
      color: "#0080FF"
    },
    {
      prettyName: "Selected",
      color: "#EDF0F0"
    }
    ]
  };

  presets["Oceanic Light"] = {
    light: true,
    elements: [
    {
      prettyName: "Background",
      color: "#eff1f5"
    },
    {
      prettyName: "Cursor",
      color: "#000000"
    },
    {
      prettyName: "Default",
      color: "#343d46"
    },
    {
      prettyName: "Keyword",
      color: "#bf616a"
    },
    {
      prettyName: "Atom",
      color: "#b48ead"
    },
    {
      prettyName: "HTML Atom",
      master: "atom",
    },
    {
      prettyName: "Definition",
      color: "#d08770"
    },
    {
      prettyName: "Variable",
      color: "#a3be8c"
    },
    {
      prettyName: "Variable 2",
      color: "#8fa1b3"
    },
    {
      prettyName: "Variable 3",
      master: "variable"
    },
    {
      prettyName: "Header",
      master: "default",
    },
    {
      prettyName: "Number",
      color: "#b48ead"
    },
    {
      prettyName: "Property",
      color: "#a3be8c"
    },
    {
      prettyName: "Attribute",
      master: "property"
    },
    {
      prettyName: "Builtin",
      master: "default",
    },
    {
      prettyName: "Qualifier",
      master: "default",
    },
    {
      prettyName: "Operator",
      master: "default",
    },
    {
      prettyName: "Meta",
      master: "default",
    },
    {
      prettyName: "String Color",
      color: "#E1AF1D"
    },
    {
      prettyName: "Secondary String",
      master: "string"
    },
    {
      prettyName: "HTML Tag",
      color: "#bf616a"
    },
    {
      prettyName: "CSS Tag",
      master: "html_tag"
    },
    {
      prettyName: "Tag Bracket",
      master: "html_tag",
    },
    {
      prettyName: "Line Number",
      color: "#bbbbbb"
    },
    {
      prettyName: "Gutter Marker",
      master: "line_number"
    },
    {
      prettyName: "Comment",
      color: "#ab7967"
    },
    {
      prettyName: "Selected",
      color: "#EDF0F0"
    }
    ]
  };

  presets["MDN Like"] = {
    light: true,
    elements: [
    {
      prettyName: "Background",
      color: "#F7F8F9"
    },
    {
      prettyName: "Cursor",
      color: "#000000"
    },
    {
      prettyName: "Default",
      color: "#4D4E53"
    },
    {
      prettyName: "Keyword",
      color: "#007BBB"
    },
    {
      prettyName: "Atom",
      color: "#4D4E53"
    },
    {
      prettyName: "HTML Atom",
      master: "atom",
    },
    {
      prettyName: "Definition",
      color: "#5C4E53"
    },
    {
      prettyName: "Variable",
      color: "#0077aa"
    },
    {
      prettyName: "Variable 2",
      color: "#669900"
    },
    {
      prettyName: "Variable 3",
      color: "#0077aa"
    },
    {
      prettyName: "Header",
      color: "#FF6400",
    },
    {
      prettyName: "Number",
      color: "#4D4E53"
    },
    {
      prettyName: "Property",
      color: "#990055"
    },
    {
      prettyName: "Attribute",
      color: "#66993E"
    },
    {
      prettyName: "Builtin",
      color: "#9B7536",
    },
    {
      prettyName: "Qualifier",
      color: "#669900",
    },
    {
      prettyName: "Operator",
      color: "#cda869",
    },
    {
      prettyName: "Meta",
      color: "#000000",
    },
    {
      prettyName: "String Color",
      color: "#0077aa"
    },
    {
      prettyName: "Secondary String",
      color: "#bd6b18"
    },
    {
      prettyName: "HTML Tag",
      color: "#9B0064"
    },
    {
      prettyName: "CSS Tag",
      master: "html_tag"
    },
    {
      prettyName: "Tag Bracket",
      master: "html_tag",
    },
    {
      prettyName: "Line Number",
      color: "#aaaaaa"
    },
    {
      prettyName: "Gutter Marker",
      master: "line_number"
    },
    {
      prettyName: "Comment",
      color: "#777777"
    },
    {
      prettyName: "Selected",
      color: "#EDF0F0"
    }
    ]
  };

  presets["DuoTone Light"] = {
    light: true,
    elements: [
    {
      prettyName: "Background",
      color: "#faf8f5"
    },
    {
      prettyName: "Cursor",
      color: "#000000"
    },
    {
      prettyName: "Default",
      color: "#b29762"
    },
    {
      prettyName: "Keyword",
      master: "default"
    },
    {
      prettyName: "Atom",
      master: "default"
    },
    {
      prettyName: "HTML Atom",
      master: "atom",
    },
    {
      prettyName: "Definition",
      color: "#2d2006"
    },
    {
      prettyName: "Variable",
      master: "atom",
    },
    {
      prettyName: "Variable 2",
      color: "#896724"
    },
    {
      prettyName: "Variable 3",
      master: "variable_2"
    },
    {
      prettyName: "Header",
      color: "#2d2006",
    },
    {
      prettyName: "Number",
      master: "default"
    },
    {
      prettyName: "Property",
      color: "#b29762"
    },
    {
      prettyName: "Attribute",
      master: "default"
    },
    {
      prettyName: "Builtin",
      color: "#2d2006",
    },
    {
      prettyName: "Qualifier",
      color: "#2d2006",
    },
    {
      prettyName: "Operator",
      color: "#0e4ecd",
    },
    {
      prettyName: "Meta",
      master: "default",
    },
    {
      prettyName: "String Color",
      color: "#1657da"
    },
    {
      prettyName: "Secondary String",
      color: "#896724"
    },
    {
      prettyName: "HTML Tag",
      color: "#2d2006"
    },
    {
      prettyName: "CSS Tag",
      master: "html_tag"
    },
    {
      prettyName: "Tag Bracket",
      master: "html_tag",
    },
    {
      prettyName: "Line Number",
      color: "#dbcfb8"
    },
    {
      prettyName: "Gutter Marker",
      master: "line_number"
    },
    {
      prettyName: "Comment",
      color: "#b6ad9a"
    },
    {
      prettyName: "Selected",
      color: "#EEECEA"
    }
    ]
  };

  var setupElement = function(element) {
    for (var i = 0; i < elementGlobals.length; i++) {
      var global = elementGlobals[i];
      if (global.prettyName === element.prettyName) {
        if (element.master && element.color) {
          console.warn(presetName + ": both color and master present on " + element.prettyName);
        } else if (element.color) {
          if (element.color[0] !== "#" || element.color.length !== 7) {
            console.warn(presetName + ": invalid color " + element.color + " on " + element.prettyName);
          }
        } else if (element.master) {
          if (element.master[0] == "#") {
            console.warn(presetName + ": invalid master " + element.master + " on " + element.prettyName);
          }
        }
        element.selector = global.selector;
        if (global.description) { element.description = global.description; }
        if (global.prop) { element.prop = global.prop; }
        return;
      }
    }
  };

  for (var preset in presets) {
    var presetName = preset;
    preset = presets[preset];
    var numElements = preset.elements.length;
    var expectedElements = elementGlobals.length;
    if (numElements !== expectedElements) {
      console.warn("Invalid number of elements (saw " + numElements + ", expected " + expectedElements);
    }
    preset.elements.forEach(setupElement);
  }
  return presets;
})();
