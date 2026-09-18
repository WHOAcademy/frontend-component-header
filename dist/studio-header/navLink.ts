import type { MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';

export interface NavLinkItem {
  href: string;
  external?: boolean;
  openInNewTab?: boolean;
  onClick?: MouseEventHandler;
}

// Props for rendering `item` as an internal route, a plain external link, or a new-tab external
// link. Spread onto Dropdown.Item / Nav.Link (which accept an `as` override) or destructure `as`
// out to pick between `<a>`/`<Link>` directly.
const getLinkProps = (item: NavLinkItem) => {
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

export default getLinkProps;
