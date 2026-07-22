import React, { type ReactNode, type ComponentProps } from 'react';
import classNames from 'classnames';
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
import { type NavDropdownMenuItem } from './NavDropdownMenu';
import StudioHeaderSearchButtonSlot from '../plugin-slots/StudioHeaderSearchButtonSlot';
import StudioHeaderMainMenuSlot from '../plugin-slots/StudioHeaderMainMenuSlot';

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
  isMobile?: boolean;
  isHiddenMainMenu?: boolean;
  // Current course/library key, threaded through so main-menu plugins can build scoped links.
  contextId?: string;
  mainMenuDropdowns?: {
    id: string;
    buttonTitle: ReactNode;
    items: NavDropdownMenuItem[];
  }[];
  outlineLink?: string;
  searchButtonAction?: React.MouseEventHandler<HTMLButtonElement>;
  containerProps?: Omit<ComponentProps<typeof Container>, 'children'>;
}

const HeaderBody = ({
  logo,
  logoAltText,
  number,
  org,
  title,
  username,
  studioBaseUrl,
  logoutUrl,
  authenticatedUserAvatar,
  isMobile,
  contextId,
  setModalPopupTarget = null,
  toggleModalPopup,
  isModalPopupOpen = false,
  isHiddenMainMenu = false,
  mainMenuDropdowns = [],
  outlineLink,
  searchButtonAction,
  containerProps = {},
}: HeaderBodyProps) => {
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
            {!isMobile && (
              <StudioHeaderMainMenuSlot
                mainMenuDropdowns={[]}
                contextId={contextId}
                org={org}
                number={number}
                title={title}
                isHiddenMainMenu
              />
            )}
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
            ) : (
              <StudioHeaderMainMenuSlot
                mainMenuDropdowns={mainMenuDropdowns}
                contextId={contextId}
                org={org}
                number={number}
                title={title}
                isHiddenMainMenu={false}
              />
            )}
          </>
        )}
        <ActionRow.Spacer />
        <StudioHeaderSearchButtonSlot
          searchButtonAction={searchButtonAction}
        />
        <Nav>
          <UserMenu
            {...{
              username,
              studioBaseUrl,
              logoutUrl,
              authenticatedUserAvatar,
              isMobile,
            }}
          />
        </Nav>
      </ActionRow>
    </Container>
  );
};

export default HeaderBody;
