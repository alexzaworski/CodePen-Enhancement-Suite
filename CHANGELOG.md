# Change Log

## v0.5.0

### Added

* Added a small visiual indicator when new items are added to your activity feed.

## v0.4.5

### Fixed

* Fixed encoding issue on comment previews

## v0.4.4

### Fixed

* Fixed listing of followers/following in profile previews (they were swapped)
* Fixed bug that occasionally prevented profile previews from displaying

## v0.4.3

### Fixed

* Attempting to load conditional modules on pages that don't have an associated pageType no longer causes an error

## v0.4.2

### Fixed

* Added underline to matching brackets while using a custom theme

## v0.4.1

### Fixed

* Fix link to typeahead in patch notes modal

## v0.4.0

### Added

* Added Recent Pens Typeahead module — view your recent (public) Pens in the CSS/JS external resource typeaheads

### Changed

* Improved coverage on profile previews. Now they work on Pens, Posts, comments, etc. 

## v0.3.2

### Removed

* Removed inline JS lint module (made obsolete by CodePen UI updates)

## v0.3.1

### Fixed

* Fixed bug with update modals that would cause the DOM to become unresponsive when creating a new Pen (my bad..)

## v0.3.0

### Added

* Added user previews when hovering over a profile link
* Added a button in the JavaScript Editor for easy access to linting

### Fixed

* `Selected` color from custom themes now applies to searched text

## v0.2.6

### Fixed

* Fixed problem with Pen preview resizer that prevented scrolling

## v0.2.5

### Fixed

* Increased contrast of selection color on default custom theme
* Fix bug that caused selection color of a custom theme to bleed through to the post editor
* Fix bug that prevented the light base theme from activating

## v0.2.4

### Fixed

* Fixed JS error thrown on pages that don't have the page-wrap class
* Fixed coloring of gear icon on the new post page

## v0.2.3

### Fixed

* Fixed bug that would occasionally cause the Pen resizer to display incorrectly when using custom themes

## v0.2.2

### Fixed

* Fixed bug that caused small sliver of background color to appear below scrollbars when using light custom themes

## v0.2.1

### Fixed

* Fixed issue that caused invisible scrollbars when using custom themes

## v0.2.0

### Added

* Added custom editor themes

## v0.1.6

### Fixed

* Fixed bug that prevented the comment preview toggle from properly appending itself

## v0.1.5

### Fixed

* Fixed parsing of init data, which would sometimes fail.

## v0.1.4

### Fixed

* Comment previews longer than one line no longer collapse on themselves.

## v0.1.3

### Added

* Added GUI to enable/disable javascript in previews

## v0.1.2

### Removed

* Custom Pen slug functionality disabled due to changes on CodePen's end that broke it

### Changed

* CES Save module wrapped into the Editor Settings module since without Pen slugs everything is a lot less complicated

## v0.1.1

### Added

* Resizable Pen Previews
* Custom Pen Slugs
* Access Editor Settings from Within the Pen Editor
* Preview Comments on Pens/Posts Before Submitting
* Toggle Custom CSS on CodePen PRO User's Profiles
