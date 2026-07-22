# Studio Header Main Menu Slot

### Slot ID: `org.openedx.frontend.layout.studio_header_main_menu.v1`

## Description

Wraps the Studio (CMS) header's main navigation. On a course/library page this is the
Content / Settings / Tools dropdown row; on context-less pages (e.g. Studio Home, where
`isHiddenMainMenu` is `true`) the default renders nothing, but a plugin may render its own
navigation there.

The default widget receives these props, exposed as `widget.content` via `mergeProps`:
- `mainMenuDropdowns`: `{ id, buttonTitle, items }[]` — the dropdowns to render. Each item is
  `{ title, href, external?, openInNewTab? }` (`external` renders a plain `<a>`; `openInNewTab`
  also opens a new tab and shows an external-link icon).
- `contextId`, `org`, `number`, `title`: current course context, for building course-scoped links.
- `isHiddenMainMenu`: `true` on pages with no course/library context.

## Example — add course-scoped items and a context-less nav

```jsx
import { PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';

const modifyMainMenu = (widget) => {
  const {
    contextId, title, isHiddenMainMenu, mainMenuDropdowns = [],
  } = widget.content;

  if (isHiddenMainMenu) {
    // Studio Home: render a custom context-less nav.
    widget.content.mainMenuDropdowns = [
      { id: 'analytics', buttonTitle: 'Analytics', items: [
        { title: 'Dashboard', href: 'https://analytics.example.com', openInNewTab: true },
      ] },
    ];
    return widget;
  }

  // Course page: append items to the existing Tools dropdown.
  const tools = mainMenuDropdowns.find((d) => d.id.startsWith('Tools'));
  tools?.items.push({
    title: 'Instructor Dashboard',
    href: `https://lms.example.com/courses/${contextId}/instructor`,
    external: true,
  });
  return widget;
};

const config = {
  pluginSlots: {
    'org.openedx.frontend.layout.studio_header_main_menu.v1': {
      keepDefault: true,
      plugins: [
        { op: PLUGIN_OPERATIONS.Modify, widgetId: 'default_contents', fn: modifyMainMenu },
      ],
    },
  },
};

export default config;
```
