import React from 'react';
import { Icon } from '@openedx/paragon';
import { OpenInNew } from '@openedx/paragon/icons';
import { Link } from 'react-router-dom';

export interface NavItemLinkEntry {
  href: string;
  /** Renders a plain <a> instead of a client-side <Link>, for URLs outside this MFE. */
  external?: boolean;
  /** Implies external; opens in a new tab and shows an external-link icon. */
  openInNewTab?: boolean;
}

// Shared by NavDropdownMenu, StudioHeaderMainMenu, and MobileMenu: resolves an item to the
// `as`/`href`/`to`/`target`/`rel` props its host element (Dropdown.Item, Nav.Link, or <a>) needs.
export const getNavItemLinkProps = (item: NavItemLinkEntry) => {
  if (item.openInNewTab) {
    return {
      as: 'a' as const, href: item.href, target: '_blank', rel: 'noopener noreferrer',
    };
  }
  if (item.external) {
    return { as: 'a' as const, href: item.href };
  }
  return { as: Link, to: item.href };
};

export const ExternalLinkIcon = ({ className = 'd-inline-block ml-1' }: { className?: string }) => (
  <Icon src={OpenInNew} className={className} style={{ height: '1rem', width: '1rem' }} />
);
