# Expedition Grundeinkommen / Gatsby Theme

## Yarn workspaces

Develop site: `yarn workspace site develop` (theme can not run in dev mode directly, since the gatsby-config is exported as a function)

## Shadow site

## Configure site

In `./site/gatsby-config.js` pass parameters to the gatsby-theme via the `options` object:

```js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-theme",
      options: {
        message: "Hello Theme",
      },
    },
  ],
};
```

## Using the options in the gatsby theme:

In `./gatsby-theme/gatsby-config.js` retrieve the parameters in `module.exports`:

```js
module.exports = (options) => {
  console.log("***");
  console.log(options.message);
  console.log("***");
  return config;
};
```

## For the documentation:

- Explain shadowing and mention that you have to rebuild the dev bundle, if you added a new file that you want to be shadowed
- Link to https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/ and briefly explain how to import and extend shadowed files and 
- Show hot to change paddings and margins
- Describe how the css-color-variables work in relation to the section colors, modals and buttons and show which files would have to be modified to change that
- Explain shadowing for the Logo and how different file formats and file names are accepted, it will just take the first image (.png, .jpg, .svg) in `src/gatsby-theme/assets/logo`




## Status: changes for the design and assets

We mainly want to use gatsbys shadowing feature:
https://www.gatsbyjs.com/docs/themes/shadowing/

Only if necessary, we want to pass javascript-parameters to the file via the `gatsby-config.js`

--> More freedom, but also more responsibility for the users of the theme.

### For the gatsby-theme shadowing feature

Done: Moving `src/components/style` to `/src/style`  
Done: Creating `src/assets` all reusable assets ~~that are not tightly coupled to a component~~ should be there.  
Done: The main less-definitions – `base.less`, `vars.less`, `webfont.less` – should be split up into `{file}_config.less`, `{file}_default.less` and `{file}.less}` components:

   Done: \_default: sets the white-label-theme  
   Done: \_config: can be shadowed by the users of the theme (and us) to overwrite and add to the defaults.
   Done: {file}.less imports both so the defaults are always defined, even if users choose to only partially change them


### Less variables

1. Renaming variables in `style/vars_default.less`:

Idea:
```less
@red: --> @primaryColor
@blueBright: --> @secondaryColor
@yellow: --> @tertiarycolor (@accentColor)
--> @darkGrey
@grey: --> @midGrey
@greyBright: --> @lightGrey
@white: --> @white (@background)
--> @black
```

Done:
```less
@sectionColor1: #fef377;        // @yellow
@sectionColor2: #fc484c;        // @red
@textOnSectionColor2: #f5f5f5;  // @greyBright
@sectionColor3: #f0f0f0;        // @grey
@accentColor1: #22c8ee;         // @blueBright
@accentColor2: #3423f6;         // @blueDark
@accentColor3: #e5b5c8;         // @rose
@accentColor4: #7d69f6;         // @pink
@menuBackgroundColor: white;    // @white
@strokeOnIcons: #1D1D1B;        // @black
```

**--> Necessary re-factor in the individual style modules in the components**

Done: Adding variables in `style/vars_default.less`

```less
@fontStack: Tahoma, Arial, Helvetica, sans-serif;
```

The `_config` is shadowed in our use case:

```less
@fontStack: "Ideal", Tahoma, Arial, Helvetica, sans-serif;
```


Done: html-tag: font-size (default)  
Done: background-image im header and renamed assets 
Done: Supporting different file formats for the Logo --> shadowing a folder and grabbing first image in that folder with webpack


### Further considerations

- How convenient is shadowing the assets for us? Do we always have to provide a white-label-version of our main background images then? Can we bundle custom xbge illustrations in the gatsby-theme (are there license issues)?


### Nice-to-haves
- More assets for the white-label-theme
- Nicer color scheme for white-label-theme
- Option to provide a link for the logo (contentful?, gatsby-config?)
- Changing import of SVGs, so they support currentColor (not really important for the white-label-theme, since it only applies to xbge custom assets, would make it easier for us to change colors though)
  - Inline SVG loader is available here for example already: `/gatsby-theme/gatsby-theme/src/components/AboutUs/index.js`