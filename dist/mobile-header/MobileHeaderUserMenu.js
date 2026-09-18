import React from 'react';
import PropTypes from 'prop-types';
const MobileHeaderUserMenu = ({
  menu
}) => menu.map(group => group.items.map(({
  type,
  content,
  href,
  disabled,
  isActive,
  onClick
}) => /*#__PURE__*/React.createElement("li", {
  className: "nav-item",
  key: `${type}-${content}`
}, /*#__PURE__*/React.createElement("a", {
  className: `nav-link${isActive ? ' active' : ''}${disabled ? ' disabled' : ''}`,
  href: href,
  onClick: onClick || null
}, content))));
export const mobileHeaderUserMenuDataShape = PropTypes.arrayOf(PropTypes.shape({
  heading: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['item', 'menu']),
    href: PropTypes.string,
    content: PropTypes.string,
    isActive: PropTypes.bool,
    onClick: PropTypes.func
  }))
}));
MobileHeaderUserMenu.propTypes = {
  menu: mobileHeaderUserMenuDataShape
};
export default MobileHeaderUserMenu;
//# sourceMappingURL=MobileHeaderUserMenu.js.map