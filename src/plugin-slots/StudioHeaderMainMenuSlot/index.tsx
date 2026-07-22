import React, { type FunctionComponent } from 'react';
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import StudioHeaderMainMenu, { type StudioHeaderMainMenuProps } from '../../studio-header/StudioHeaderMainMenu';

/**
 * Wraps the Studio (CMS) header's main navigation (the Content/Settings/Tools dropdowns on a
 * course page, and any custom navigation on context-less pages such as Studio Home). Unlike the
 * LMS/learning header, the Studio header's nav is prop-driven with no built-in extension point,
 * so this slot lets a plugin add or modify the top-nav dropdowns without forking this package.
 *
 * The default widget's props are exposed as `widget.content` (via `mergeProps`), so a
 * `PLUGIN_OPERATIONS.Modify` plugin can read `contextId` / `org` / `number` / `title` /
 * `isHiddenMainMenu` and mutate `mainMenuDropdowns` to inject its own items.
 */
const StudioHeaderMainMenuSlot: FunctionComponent<StudioHeaderMainMenuProps> = (props) => (
  <PluginSlot
    id="org.openedx.frontend.layout.studio_header_main_menu.v1"
    slotOptions={{
      mergeProps: true,
    }}
  >
    <StudioHeaderMainMenu {...props} />
  </PluginSlot>
);

export default StudioHeaderMainMenuSlot;
