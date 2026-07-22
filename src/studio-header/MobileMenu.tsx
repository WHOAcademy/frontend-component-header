import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible } from '@openedx/paragon';
import { getNavItemLinkProps, ExternalLinkIcon } from './navItemLink';

const MobileMenuItemLink = ({ item }) => {
  const { as: Component, ...linkProps } = getNavItemLinkProps(item);
  // `linkProps`'s shape depends on which `Component` it resolved to (`'a'` vs `Link`); TS can't
  // verify that pairing through a variable, same as react-bootstrap's own `as`-prop components.
  return React.createElement(
    Component as React.ElementType,
    linkProps,
    item.title,
    item.openInNewTab && <ExternalLinkIcon className="float-right" />,
  );
};

MobileMenuItemLink.propTypes = {
  item: PropTypes.shape({
    href: PropTypes.string,
    title: PropTypes.node,
    external: PropTypes.bool,
    openInNewTab: PropTypes.bool,
  }).isRequired,
};

const MobileMenu = ({ mainMenuDropdowns }) => (
  <div
    className="ml-4 p-2 bg-light-100 border border-gray-200 small rounded"
    data-testid="mobile-menu"
  >
    <div>
      {mainMenuDropdowns.map(dropdown => {
        const { id, buttonTitle, items } = dropdown;
        return (
          <Collapsible
            className="border-light-100"
            title={buttonTitle}
            key={id}
          >
            <ul className="p-0" style={{ listStyleType: 'none' }}>
              {items.map(item => (
                <li className="mobile-menu-item">
                  <MobileMenuItemLink item={item} />
                </li>
              ))}
            </ul>
          </Collapsible>
        );
      })}
    </div>
  </div>
);

MobileMenu.propTypes = {
  mainMenuDropdowns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    buttonTitle: PropTypes.node,
    items: PropTypes.arrayOf(PropTypes.shape({
      href: PropTypes.string,
      title: PropTypes.node,
      external: PropTypes.bool,
      openInNewTab: PropTypes.bool,
    })),
  })),
};
MobileMenu.defaultProps = {
  mainMenuDropdowns: [],
};

export default MobileMenu;
