# CodePen Enhancement Suite v0.4.0

A Chrome extension meant to enhance the CodePen experience. Like [RES](https://github.com/honestbleeps/Reddit-Enhancement-Suite).

## Installation

[Available from the Chrome web store.](https://chrome.google.com/webstore/detail/codepen-enhancement-suite/olmbnbpkgkagfnkdmaehjcpdkfkfokim)

To install in dev mode:

1. `git clone` 
2. [Follow these instructions](https://developer.chrome.com/extensions/getstarted#unpacked)

## Current Features

* [\[NEW\] Quick-Add Your Pens as an External Resource](#new-quick-add-your-pens-as-an-external-resource)
* [\[UPDATED\] Profile Previews](#updated-profile-previews)
* [Custom Editor Themes](#custom-editor-themes)
* [Resizable Pen Previews](#resizable-pen-previews)
* [Access Editor Settings from Within the Pen Editor](#access-editor-settings-from-within-the-pen-editor)
* [Preview Comments on Pens/Posts Before Submitting](#preview-comments-on-pensposts-before-submitting)
* [Toggle Custom CSS on User Profiles](#toggle-custom-css-on-user-profiles)
* [Toggle Pen preview JS with a GUI](#toggle-pen-preview-js-with-a-gui)

### [NEW] Quick-Add Your Pens as an External Resource

Adds your most recent public Pens to the CSS/JS typeaheads.

Want to quickly filter out your Pens? Just search `::`.

### [UPDATED] Profile Previews

Hover over a profile link for more details on that user. Currently works in the following places:

* Browsing Pens
* Browsing Posts
* Pen/Post Comments
* Pen Details View


![Profile Hover Preview](https://s3-us-west-2.amazonaws.com/s.cdpn.io/186499/profile-hover.gif)

### Custom Editor Themes

Adds the ability to customize your editor theme via a GUI. Allows you to adjust the following:

* Syntax highlighting
* Background/cursor colors
* CodePen UI colors (light/dark)

![Custom Eidtor Themes](https://s3-us-west-2.amazonaws.com/s.cdpn.io/186499/custom_editor_theme.png)

### Resizable Pen Previews

Adds a draggable handle in the `Editor View` while using the `Top` layout that allows you to change the size of your Pen, making the experience of debugging responsive Pens a lot more pleasant. 

![Resizable Preview Demos](https://s3-us-west-2.amazonaws.com/s.cdpn.io/186499/resize_previews.gif)

### Access Editor Settings from Within the Pen Editor

Adds another tab to the `Pen Settings` modal that lets you change current theme/font/font size. Only works if you're using the editor over HTTPS.

![Editor Settings Demo](https://s3-us-west-2.amazonaws.com/s.cdpn.io/186499/editor_settings.gif)

### Preview Comments on Pens/Posts Before Submitting

Pretty straightforward. Relies on CodePen's internal markdown processing to generate previews which is kinda neat. It won't compile @username links, but most everything else works.

![Comment Preview Demo](https://s3-us-west-2.amazonaws.com/s.cdpn.io/186499/comment_preview.gif)

### Toggle Pen preview JS with a GUI

Makes things a little bit easier if you find yourself locked out of a Pen/need to disable javascript for some other reason.

![Disable JS Demo](https://s3-us-west-2.amazonaws.com/s.cdpn.io/186499/disable_js_toggle.png)

### Toggle Custom CSS on User Profiles

CodePen users can be pretty creative. Sometimes _too_ creative. This lets you turn off a user's custom profile CSS with a toggle switch.

![Disable CSS Demo](https://s3-us-west-2.amazonaws.com/s.cdpn.io/186499/profile_css.gif)

## Why Didn't You Do (Thing)?

(Thing) sounds like a really good idea. Open an issue and I'll see what I can do. Any bug reports are welcome too, please contribute!
