# BCGov Block Theme support framework 
## Provides supplemental scripts and styles

A Vite-based BCGov Block Theme augmentation framework for adding additional built scripts and styles to a specific installation.

This allows for SCSS and vanilla Javascript module-based development by providing assets that can be uploaded as Asset Loader additions to the Media Library and enqueued to either the public facing or admin environment. 

The intent of this environment is to be used for lightweight additions to styles or DOM manipulation that is beyond the scope of what WordPress itself can manage inside the core block theme environment. While CSS can be included via the "Additional CSS" feature inside the Full Site Editor Styles inspector, this method has the added benefit of client-side file caching and front-end feature enhancement that would otherwise require inclusion at the theme or plugin level.

## Use case for this approach

Despite its extensive features, WordPress's default capabilities may need augmentation for accessibility purposes. Accessibility ensures that all users, including those with disabilities, can access and navigate websites effectively. The default WordPress capabilities in conjunction with a site's implementation may not fully comply with Web Content Accessibility Guidelines (WCAG), potentially leading to barriers for users with visual, auditory, cognitive, or motor impairments. Enhancing WordPress's accessibility often involves using specialized plugins, custom themes, and adherence to best practices in web design and development to provide an inclusive experience for all users. This includes augmenting features for keyboard navigation, screen reader support, color contrast adjustments, and text resizing options.

As an example, the (actions.js[https://github.com/codewisenate/declaration-block-theme-supplemental/blob/main/scripts/declaration/actions.js]) script in this repository improves the website's accessibility by making visual icons descriptive, sorting Actions content logically (as they use pseudo-numeric titles – eg: 1.01, 1.02, etc.) and providing meaningful text labels and ARIA attributes throughout to enhance context for screen reader support. Features that could not be accomplished using WordPress in an editorial-only approach.

## How to use on testing, staging or production

- Adding scripts and styles to a BCGov Block Theme site is accomplished by uploading compiled/transpiled CSS and/or JavaScript to the Media Library and enqueing through the "Attachment Details" modal.
- Required plugins: both the **BCGov Allow Javascript** and **BCGov Assets Loader** must be enabled for this feature to fully work. 
- CSS and JavaScript files can be enqueued for Public or Admin side using the checkboxes that are exposed via the BCGov Assets Loader plugin. If this plugin is enabled and you do not see these options, you will need an admin to enable your user account for this feature.
- In your user profile you will need to see the **asset-loader** listed under "Additional Capabilities" – if you do not see this, you will not be able to enqueue additional scripts or styles.

## Entry points

For public facing style updates use:
- `/styles/public-additional-styles.scss` for SCSS efforts
- `/scripts/public-additional-scripts.js` for Javascript efforts

There are occasions when the changes made to public facing styles should also be replicated in the block editing environment. So for any admin side specific style updates use:
- `/styles/admin-additional-styles.scss`

## Build files

For watching changes and generating new builds on save:
```
npm run build:watch
```

For one off builds:
```
npm run build
```

Files from either of these commands will be found in **`/dist/assets/`** – as noted above these files should then be uploaded to the Media Library and enqueued for Public or Admin use (or both) respectively. By default only styles are provided for enqueing on the admin side. You are safe to ignore any other files exported to the `dist` directory. It should also be noted that previous files uploaded and enqueued should be removed/deleted from the Media Library so as to not cause errors or unintended consequences.

## Helper functions

Additional helpers Javascript functions are in `/scripts/utils.js`. Should you need to add your own helper functions, this file has been provided and is chunked into its own build file:
- `qs`: a shorthand querySelect which returns the first element matching the given CSS selector within the given parent element
- `qsa`: a shorthand querySelectAll that returns an actual array of all elements matching the given CSS selector within the given parent element
- `createElement`: a better version of document.createElement that allows for creating an HTML element and passing in an object of attributes
- `addGlobalEventListener`: a utility function that attaches an event listener to the given parent element and triggers the callback function only if the event target matches the given selector 