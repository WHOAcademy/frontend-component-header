import React, { type FunctionComponent, type ReactNode } from 'react';
import { Nav } from '@openedx/paragon';
import NavDropdownMenu, { type NavDropdownMenuItem } from './NavDropdownMenu';
import { getNavItemLinkProps, ExternalLinkIcon, type NavItemLinkEntry } from './navItemLink';

// A dropdown entry has `items`; a plain-link entry is a NavItemLinkEntry instead.
export type StudioHeaderMainMenuEntry = { id: string; buttonTitle: ReactNode } & (
  | { items: NavDropdownMenuItem[]; href?: undefined }
  | (NavItemLinkEntry & { items?: undefined })
);

// contextId/org/number/title/isHiddenMainMenu aren't read in this file — they're API surface for
// a plugin mounted on this slot, read via widget.RenderWidget.props (see withWhoNavItems).
/* eslint-disable react/no-unused-prop-types */
export interface StudioHeaderMainMenuProps {
  mainMenuDropdowns?: StudioHeaderMainMenuEntry[];
  contextId?: string;
  org?: string;
  number?: string;
  title?: string;
  isHiddenMainMenu?: boolean;
}
/* eslint-enable react/no-unused-prop-types */

const MainMenuLink = ({ entry }: { entry: NavItemLinkEntry & { buttonTitle: ReactNode } }) => (
  <Nav.Link className="mr-2" {...getNavItemLinkProps(entry)}>
    {entry.buttonTitle}
    {entry.openInNewTab && <ExternalLinkIcon />}
  </Nav.Link>
);

const StudioHeaderMainMenu: FunctionComponent<StudioHeaderMainMenuProps> = ({
  mainMenuDropdowns = [],
}) => {
  // Renders nothing until a plugin injects entries (e.g. Studio Home before withWhoNavItems runs).
  if (mainMenuDropdowns.length === 0) {
    return null;
  }
  return (
    <Nav data-testid="desktop-menu" className="ml-2">
      {mainMenuDropdowns.map((entry) => (
        entry.items
          ? (
            <NavDropdownMenu
              key={entry.id}
              id={entry.id}
              buttonTitle={entry.buttonTitle}
              items={entry.items}
            />
          )
          : <MainMenuLink key={entry.id} entry={entry} />
      ))}
    </Nav>
  );
};

export default StudioHeaderMainMenu;
