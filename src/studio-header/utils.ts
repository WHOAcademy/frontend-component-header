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

const decodeJwtPayload = (token) => {
  const payload = token.split('.')[1];
  if (!payload) {
    return null;
  }
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const bytes = Uint8Array.from(window.atob(padded), (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
};

const getSsoLogoutUrl = (idToken) => {
  const { SSO_LOGOUT_URL: ssoLogoutUrl } = getConfig();
  if (ssoLogoutUrl) {
    return ssoLogoutUrl;
  }
  try {
    const { iss } = decodeJwtPayload(idToken) || {};
    return iss ? `${iss.replace(/\/$/, '')}/protocol/openid-connect/logout` : null;
  } catch (error) {
    return null;
  }
};

const performStudioLogout = async (logoutUrl) => {
  const { LMS_BASE_URL: lmsBaseUrl } = getConfig();
  try {
    const response = await getAuthenticatedHttpClient().post(
      `${lmsBaseUrl}/api/openedx-plugin-app/auth/sso_logout_token`,
    );
    const { error, id_token: idToken } = response.data?.data || {};
    const ssoLogoutUrl = !error && idToken ? getSsoLogoutUrl(idToken) : null;
    if (ssoLogoutUrl) {
      const params = new URLSearchParams({
        post_logout_redirect_uri: logoutUrl,
        id_token_hint: idToken,
      });
      const separator = ssoLogoutUrl.includes('?') ? '&' : '?';
      window.location.href = `${ssoLogoutUrl}${separator}${params.toString()}`;
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
