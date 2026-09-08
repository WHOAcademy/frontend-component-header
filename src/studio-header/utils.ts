import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient, getAuthenticatedUser } from '@edx/frontend-platform/auth';
import messages from './messages';

// Classifies the current page into a feedback "subject".
const getFeedbackSubject = (pathname) => {
  if (pathname.includes('/library')) { return 'libraries'; }
  if (pathname.includes('/settings/advanced')) { return 'advanced_settings'; }
  if (pathname.includes('/certificates')) { return 'credentials'; }
  if (pathname.includes('/container')) { return 'course_creation'; }
  if (pathname.includes('/course/')) { return 'course_outline'; }
  return 'overall_platform';
};

const getFeedbackItem = (intl) => {
  const { USER_FEEDBACK_URL: userFeedbackUrl } = getConfig();
  if (!userFeedbackUrl) {
    return null;
  }
  const user = getAuthenticatedUser();
  const params = new URLSearchParams({
    page_url: window.location.href,
    email: user?.email || '',
    subject: getFeedbackSubject(window.location.pathname),
  });
  return {
    href: `${userFeedbackUrl}&${params.toString()}`,
    title: intl.formatMessage(messages['header.user.menu.feedback']),
    openInNewTab: true,
  };
};

// Calls the SSO logout-token API to fetch an id_token for the current user, then redirects
// to `logoutUrl` with that token attached so the IdP session is torn down too. Falls back to
// a plain redirect to `logoutUrl` if the API call fails or returns no token.
const performStudioLogout = async (logoutUrl) => {
  const { LMS_BASE_URL: lmsBaseUrl } = getConfig();
  try {
    const response = await getAuthenticatedHttpClient().post(
      `${lmsBaseUrl}/api/openedx-plugin-app/auth/sso_logout_token`,
    );
    const { error, id_token: idToken } = response.data?.data || {};
    if (!error && idToken) {
      const separator = logoutUrl.includes('?') ? '&' : '?';
      window.location.href = `${logoutUrl}${separator}id_token_hint=${idToken}`;
      return;
    }
  } catch (error) {
    // Fall through to the default logout below.
  }
  window.location.href = logoutUrl;
};

const getLogoutItem = (logoutUrl, intl) => ({
  href: `${logoutUrl}`,
  title: intl.formatMessage(messages['header.user.menu.logout']),
  external: true,
  onClick: (e) => {
    e.preventDefault();
    performStudioLogout(logoutUrl);
  },
});

const getUserMenuItems = ({
  studioBaseUrl,
  logoutUrl,
  intl,
  isAdmin,
}) => {
  let items = [
    {
      href: `${studioBaseUrl}`,
      title: intl.formatMessage(messages['header.user.menu.studio']),
    },
    getLogoutItem(logoutUrl, intl),
  ];
  if (isAdmin) {
    items = [
      {
        href: `${studioBaseUrl}`,
        title: intl.formatMessage(messages['header.user.menu.studio']),
      },
      getLogoutItem(logoutUrl, intl),
    ];
  }

  const feedbackItem = getFeedbackItem(intl);
  return feedbackItem ? [...items.slice(0, -1), feedbackItem, items[items.length - 1]] : items;
};

export default getUserMenuItems;
