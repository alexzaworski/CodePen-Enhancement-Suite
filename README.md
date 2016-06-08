# CodePen Enhancement Suite v0.1.6

A Chrome extension meant to enhance the CodePen experience. Like [RES](https://github.com/honestbleeps/Reddit-Enhancement-Suite).

## Current Features

* [Resizable Pen Previews](#resizable-pen-previews)
* [Access Editor Settings from Within the Pen Editor](#access-editor-settings-from-within-the-pen-editor)
* [Preview Comments on Pens/Posts Before Submitting](#preview-comments-on-pensposts-before-submitting)
* [Toggle Custom CSS on CodePen PRO User's Profiles](#toggle-custom-css-on-codepen-pro-users-profiles)
* [Toggle Pen preview JS with a GUI](#toggle-pen-preview-js-with-a-gui)

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

### Toggle Custom CSS on CodePen PRO User's Profiles

CodePen users can be pretty creative. Sometimes _too_ creative. This lets you turn off a user's custom profile CSS with a toggle switch. It keeps track of users you currently have disabled via Chrome's storage API so you don't need to hit the toggle every time you land on a given user's profile.

![Disable CSS Demo](https://s3-us-west-2.amazonaws.com/s.cdpn.io/186499/profile_css.gif)

## Installation

[Available from the Chrome web store.](https://chrome.google.com/webstore/detail/codepen-enhancement-suite/olmbnbpkgkagfnkdmaehjcpdkfkfokim)

To install in dev mode:

1. `git clone` 
2. [Follow these instructions](https://developer.chrome.com/extensions/getstarted#unpacked)


## Why Didn't You Do (Thing)?

(Thing) sounds like a really good idea. Open an issue and I'll see what I can do. Any bug reports are welcome too, please contribute!
