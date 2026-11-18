# Shreya Kankanhalli academic website

This repository preserves the existing website design while moving editable content into `content/site.json`.

## Editing

Pages CMS provides a browser editor for the biography, publications, working papers, work in progress, and teaching. Saving an edit commits the content change to GitHub. GitHub Pages then rebuilds and publishes the site automatically.

## Local build

```sh
npm run build
```

The generated site appears in `dist/`.

The custom domain should not be moved until the replacement has been built, reviewed, and published at its temporary GitHub Pages address.
