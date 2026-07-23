import React, { type FunctionComponent, useContext } from 'react';
import Responsive from 'react-responsive';
import { AppContext } from '@edx/frontend-platform/react';
import { ensureConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';

import MobileHeader from './MobileHeader';
import HeaderBody, { HeaderBodyProps } from './HeaderBody';
import { buildWhoHomeNav, addWhoCourseNavItems } from './whoNav';

ensureConfig([
  'STUDIO_BASE_URL',
  'SITE_NAME',
  'LOGOUT_URL',
  'LOGIN_URL',
  'LOGO_URL',
], 'Studio Header component');

type Props = Pick<HeaderBodyProps,
| 'number'
| 'org'
| 'title'
| 'containerProps'
| 'isHiddenMainMenu'
| 'mainMenuDropdowns'
| 'outlineLink'
| 'searchButtonAction'
> & {
  isNewHomePage: boolean;
  // Current course/library key; used to build WHO Academy's course-scoped nav items.
  contextId?: string;
};

const StudioHeader: FunctionComponent<Props> = ({
  number,
  org,
  title,
  containerProps,
  isHiddenMainMenu,
  mainMenuDropdowns,
  outlineLink,
  searchButtonAction,
  contextId,
  isNewHomePage,
}) => {
  // @ts-expect-error - frontend-platform doesn't yet have type information :/
  const { authenticatedUser, config } = useContext(AppContext);
  const intl = useIntl();
  let whoMainMenuDropdowns = mainMenuDropdowns;
  if (isHiddenMainMenu) {
    whoMainMenuDropdowns = buildWhoHomeNav(intl);
  } else if (contextId) {
    whoMainMenuDropdowns = addWhoCourseNavItems(mainMenuDropdowns, contextId, intl);
  }
  const props = {
    logo: config.LOGO_URL,
    logoAltText: `Studio ${config.SITE_NAME}`,
    number,
    org,
    title,
    containerProps,
    username: authenticatedUser?.username,
    isAdmin: authenticatedUser?.administrator,
    authenticatedUserAvatar: authenticatedUser?.avatar,
    studioBaseUrl: isNewHomePage ? '/home' : config.STUDIO_BASE_URL,
    logoutUrl: config.LOGOUT_URL,
    isHiddenMainMenu,
    mainMenuDropdowns: whoMainMenuDropdowns,
    outlineLink,
    searchButtonAction,
  };

  return (
    <div className="studio-header">
      <a className="nav-skip sr-only sr-only-focusable" href="#main">Skip to content</a>
      <Responsive maxWidth={841}>
        <MobileHeader {...props} />
      </Responsive>
      <Responsive minWidth={842}>
        <HeaderBody {...props} />
      </Responsive>
    </div>
  );
};

export default StudioHeader;
