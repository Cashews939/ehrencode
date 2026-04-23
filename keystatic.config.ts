import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local', // Später im Internet stellen wir das auf 'github' um
  },
  collections: {
    wissen: collection({
      label: 'Wissen für Vereine',
      slugField: 'title',
      path: 'src/content/wissen/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Titel' } }),
        description: fields.text({ label: 'Beschreibung', multiline: true }),
        pubDate: fields.date({ label: 'Veröffentlichungsdatum' }),
        category: fields.text({ label: 'Kategorie' }),
        // Das Bild-Feld für den Bildupload!
        thumbnail: fields.image({
          label: 'Beitragsbild',
          directory: 'src/assets/wissen',
          publicPath: '../../assets/wissen/',
        }),
        content: fields.markdoc({
          label: 'Inhalt des Artikels',
        }),
      },
    }),
  },
});