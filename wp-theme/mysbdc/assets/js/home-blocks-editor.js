/* Native Gutenberg editing for the approved NorCal sections. No external editor dependency. */
(function (wp) {
  'use strict';
  const el = wp.element.createElement;
  const { RichText, MediaUpload, MediaUploadCheck, InspectorControls, useBlockProps } = wp.blockEditor;
  const { Button, TextControl, PanelBody, Notice } = wp.components;

  (window.mysbdcHomeBlocks || []).forEach(function (definition) {
    const meta = definition.metadata;
    wp.blocks.registerBlockType(meta.name, {
      apiVersion: 3, title: meta.title, category: meta.category, icon: meta.icon,
      description: meta.description, attributes: meta.attributes, supports: meta.supports,
      edit: function EditSection(props) {
        const a = props.attributes;
        const update = (key, value) => props.setAttributes({ [key]: value });
        const allFields = definition.fields.fields.concat(...definition.fields.groups.map(group => group.fields));
        const settings = allFields.filter(f => ['url', 'image', 'video'].includes(f.type) || /Alt$/.test(f.key));
        function editField(f) {
          if (f.type === 'url' || /Alt$/.test(f.key)) return null;
          if (f.type === 'video') return el('p', { key: f.key, className: 'mysbdc-editor-hint' }, 'Background video and poster can be changed in this block’s settings. Playback controls and reduced-motion behavior are preserved.');
          if (f.type === 'image') return el('div', { key: f.key, className: 'mysbdc-editor-media' },
            a[f.key] && el('img', { src: a[f.key], alt: '', loading: 'lazy' }),
            el(MediaUploadCheck, null, el(MediaUpload, {
              allowedTypes: ['image'],
              onSelect: media => {
                const changes = { [f.key]: media.url };
                const altKey = f.key === 'imageUrl' ? 'imageAlt' : (/Image$/.test(f.key) ? f.key.replace(/Image$/, 'Alt') : null);
                if (altKey && Object.prototype.hasOwnProperty.call(a, altKey)) changes[altKey] = media.alt || '';
                props.setAttributes(changes);
              },
              render: ({ open }) => el(Button, { variant: 'secondary', onClick: open }, 'Change ' + f.label.toLowerCase())
            })));
          return el('div', { key: f.key, className: 'mysbdc-editor-field' },
            el('span', { className: 'mysbdc-editor-label', 'aria-hidden': true }, f.label),
            el(RichText, {
              tagName: f.tag || 'p', value: a[f.key],
              onChange: value => update(f.key, f.type === 'plain' ? value.replace(/<[^>]*>/g, '') : value),
              allowedFormats: f.type === 'rich' ? ['core/bold', 'core/italic'] : [],
              'aria-label': f.label, placeholder: f.label,
              className: 'mysbdc-editor-text'
            }));
        }
        return el('section', useBlockProps({ className: 'mysbdc-editor-section' }),
          el(InspectorControls, null, el(PanelBody, { title: 'Links and media', initialOpen: true },
            settings.map(f => el('div', { key: f.key },
              el(TextControl, { label: f.label, value: a[f.key], type: ['url', 'image', 'video'].includes(f.type) ? 'url' : 'text', onChange: value => update(f.key, value), __nextHasNoMarginBottom: true, __next40pxDefaultSize: true }),
              f.type === 'video' && el(MediaUploadCheck, null, el(MediaUpload, { allowedTypes: ['video'], onSelect: media => update(f.key, media.url), render: ({ open }) => el(Button, { variant: 'secondary', onClick: open }, 'Choose video') }))
            )))),
          el('div', { className: 'mysbdc-editor-section-name' }, meta.title),
          el('div', { className: 'mysbdc-editor-content' }, definition.fields.fields.map(editField)),
          definition.fields.groups.length > 0 && el('div', { className: 'mysbdc-editor-cards mysbdc-editor-cards-' + definition.fields.groups.length }, definition.fields.groups.map((group, i) => el('div', { key: i, className: 'mysbdc-editor-card' }, el('div', { className: 'mysbdc-editor-group-name' }, group.title), group.fields.map(editField)))),
          meta.name === 'mysbdc/newsletter' && el(Notice, { status: 'info', isDismissible: false }, 'The newsletter form is still a demo. Editing this section does not connect it to a mailing list.')
        );
      },
      save: function () { return null; }
    });
  });
})(window.wp);
