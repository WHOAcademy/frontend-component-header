import React, { type ReactNode } from 'react';
import {
  Dropdown,
  DropdownButton,
} from '@openedx/paragon';
import getLinkProps, { type NavLinkItem } from './navLink';

export interface NavDropdownMenuItem extends NavLinkItem {
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
    {items.map(item => (
      <Dropdown.Item
        key={`${item.title}-dropdown-item`}
        className="small"
        {...getLinkProps(item)}
        onClick={item.onClick}
      >
        {item.title}
      </Dropdown.Item>
    ))}
  </DropdownButton>
);

export default NavDropdownMenu;
