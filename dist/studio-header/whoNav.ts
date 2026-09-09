import { getConfig } from '@edx/frontend-platform';
import messages from './messages';

const encode = (id: string) => encodeURIComponent(id);

// Studio Home nav (Courses / Learning Space / Analytics).
export const buildWhoHomeNav = (intl) => {
  const {
    LEARNING_SPACES_FRONTEND_URL: learningSpaceUrl,
    LAP_WHOA_DASHBOARD_LINK: whoaDashboard,
    LAP_IARC_DASHBOARD_LINK: iarcDashboard,
  } = getConfig();

  const analyticsItems = [
    ...(whoaDashboard ? [{
      title: intl.formatMessage(messages['header.nav.analytics.whoAcademy']), href: whoaDashboard, openInNewTab: true,
    }] : []),
    ...(iarcDashboard ? [{
      title: intl.formatMessage(messages['header.nav.analytics.iarc']), href: iarcDashboard, openInNewTab: true,
    }] : []),
  ];

  return [
    { id: 'who-nav-courses', buttonTitle: intl.formatMessage(messages['header.nav.courses']), href: '/home' },
    ...(learningSpaceUrl ? [{
      id: 'who-nav-learning-space',
      buttonTitle: intl.formatMessage(messages['header.nav.learningSpace']),
      href: learningSpaceUrl,
      external: true,
    }] : []),
    ...(analyticsItems.length ? [{
      id: 'who-nav-analytics', buttonTitle: intl.formatMessage(messages['header.nav.analytics']), items: analyticsItems,
    }] : []),
  ];
};

// Adds items to a course page's Settings/Tools dropdowns.
export const addWhoCourseNavItems = (
  mainMenuDropdowns,
  contextId: string,
  intl,
  courseName?: string,
) => {
  const {
    OPENEDX_EXTENSION_FRONTEND_URL: extensionUrl,
    LMS_BASE_URL: lmsBaseUrl,
    LAP_COMMON_DASHBOARD_WITH_COURSE_NAME_FILTER_LINK: courseAnalyticsTemplate,
  } = getConfig();

  // the query string it sits in.
  const courseAnalyticsLink = courseAnalyticsTemplate && courseName
    ? courseAnalyticsTemplate.replace(/__COURSE_NAME__/g, encode(courseName))
    : '';

  return mainMenuDropdowns.map((dropdown) => {
    if (dropdown.id?.startsWith('Settings')) {
      return {
        ...dropdown,
        items: [
          ...dropdown.items,
          ...(extensionUrl ? [{
            title: intl.formatMessage(messages['header.nav.settings.awards']),
            href: `${extensionUrl}/courses/${encode(contextId)}/awards`,
            external: true,
          }] : []),
        ],
      };
    }
    if (dropdown.id?.startsWith('Tools')) {
      return {
        ...dropdown,
        items: [
          ...dropdown.items,
          ...(lmsBaseUrl ? [{
            title: intl.formatMessage(messages['header.nav.tools.instructorDashboard']),
            href: `${lmsBaseUrl}/courses/${encode(contextId)}/instructor`,
            external: true,
          }] : []),
          ...(courseAnalyticsLink ? [{
            title: intl.formatMessage(messages['header.nav.tools.courseAnalytics']),
            href: courseAnalyticsLink,
            openInNewTab: true,
          }] : []),
        ],
      };
    }
    return dropdown;
  });
};
