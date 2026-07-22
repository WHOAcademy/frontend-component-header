import React, { type ReactNode } from 'react';
import { Dropdown, DropdownButton } from '@openedx/paragon';
import { getNavItemLinkProps, ExternalLinkIcon, type NavItemLinkEntry } from './navItemLink';

export interface NavDropdownMenuItem extends NavItemLinkEntry {
  title: ReactNode;
}

interface Props {
  id: string;
  buttonTitle: ReactNode;
  items: NavDropdownMenuItem[];
}

const NavDropdownMenu = ({
  id,
  buttonTitle,
  items,
}: Props) => (
  <DropdownButton
    id={id}
    title={buttonTitle}
    variant="outline-primary"
    className="mr-2"
  >
    {items.map((item) => (
      <Dropdown.Item
        key={`${item.title}-dropdown-item`}
        className="small"
        {...getNavItemLinkProps(item)}
      >
        {item.title}
        {item.openInNewTab && <ExternalLinkIcon className="float-right" />}
      </Dropdown.Item>
    ))}
  </DropdownButton>
);

export default NavDropdownMenu;
