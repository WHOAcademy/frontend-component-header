import React, { type ReactNode, type ComponentProps } from 'react';
import classNames from 'classnames';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ActionRow,
  Button,
  Container,
  Nav,
  Row,
} from '@openedx/paragon';
import { Close, MenuIcon } from '@openedx/paragon/icons';

import CourseLockUp from './CourseLockUp';
import UserMenu from './UserMenu';
import BrandNav from './BrandNav';
import NavDropdownMenu, { type NavDropdownMenuItem } from './NavDropdownMenu';
import getLinkProps from './navLink';
import StudioHeaderSearchButtonSlot from '../plugin-slots/StudioHeaderSearchButtonSlot';
import messages from './messages';

export interface HeaderBodyProps {
  studioBaseUrl: string;
  logoutUrl: string;
  setModalPopupTarget?: ((instance: HTMLButtonElement | null) => void) | null;
  toggleModalPopup?: React.MouseEventHandler<HTMLButtonElement>;
  isModalPopupOpen?: boolean;
  number?: string;
  org?: string;
  title: string;
  logo: string;
  logoAltText: string;
  authenticatedUserAvatar?: string;
  username?: string;
  isAdmin?: boolean;
  isMobile?: boolean;
  isHiddenMainMenu?: boolean;
  mainMenuDropdowns?: ({
    id: string;
    buttonTitle: ReactNode;
    items?: NavDropdownMenuItem[];
    href?: string;
    external?: boolean;
    openInNewTab?: boolean;
  })[];
  outlineLink?: string;
  searchButtonAction?: React.MouseEventHandler<HTMLButtonElement>;
  containerProps?: Omit<ComponentProps<typeof Container>, 'children'>;
  helpUrl?: string;
}

const HeaderBody = ({
  logo,
  logoAltText,
  number,
  org,
  title,
  username,
  isAdmin,
  studioBaseUrl,
  logoutUrl,
  authenticatedUserAvatar,
  isMobile,
  setModalPopupTarget = null,
  toggleModalPopup,
  isModalPopupOpen = false,
  isHiddenMainMenu = false,
  mainMenuDropdowns = [],
  outlineLink,
  searchButtonAction,
  containerProps = {},
  helpUrl,
}: HeaderBodyProps) => {
  const intl = useIntl();
  const renderBrandNav = (
    <BrandNav
      {...{
        studioBaseUrl,
        logo,
        logoAltText,
      }}
    />
  );

  const { className: containerClassName, ...restContainerProps } = containerProps;

  const renderMainMenu = (
    <Nav data-testid="desktop-menu" className="ml-2">
      {mainMenuDropdowns.map((entry) => (
        entry.items ? (
          <NavDropdownMenu key={entry.id} id={entry.id} buttonTitle={entry.buttonTitle} items={entry.items} />
        ) : (
          <Nav.Link key={entry.id} className="mr-2" {...getLinkProps(entry as { href: string })}>
            {entry.buttonTitle}
          </Nav.Link>
        )
      ))}
    </Nav>
  );

  return (
    <Container
      size="xl"
      className={classNames('px-2.5', containerClassName)}
      {...restContainerProps}
    >
      <ActionRow as="header">
        {isHiddenMainMenu ? (
          <Row className="flex-nowrap align-items-center ml-4">
            {renderBrandNav}
            {!isMobile && renderMainMenu}
          </Row>
        ) : (
          <>
            {isMobile ? (
              <Button
                ref={setModalPopupTarget}
                className="d-inline-flex align-items-center"
                variant="tertiary"
                onClick={toggleModalPopup}
                iconBefore={isModalPopupOpen ? Close : MenuIcon}
                data-testid="mobile-menu-button"
              >
                Menu
              </Button>
            ) : (
              <div className="w-25">
                <Row className="m-0 flex-nowrap">
                  {renderBrandNav}
                  <CourseLockUp
                    {...{
                      outlineLink,
                      number,
                      org,
                      title,
                    }}
                  />
                </Row>
              </div>
            )}
            {isMobile ? (
              <>
                <ActionRow.Spacer />
                {renderBrandNav}
              </>
            ) : renderMainMenu}
          </>
        )}
        <ActionRow.Spacer />
        <StudioHeaderSearchButtonSlot
          searchButtonAction={searchButtonAction}
        />
        {helpUrl && (
          <Nav>
            <Nav.Link
              className="mr-2"
              {...getLinkProps({ href: helpUrl, openInNewTab: true })}
            >
              {intl.formatMessage(messages['header.nav.help'])}
            </Nav.Link>
          </Nav>
        )}
        <Nav>
          <UserMenu
            {...{
              username,
              studioBaseUrl,
              logoutUrl,
              authenticatedUserAvatar,
              isAdmin,
              isMobile,
            }}
          />
        </Nav>
      </ActionRow>
    </Container>
  );
};

export default HeaderBody;
