<?php

/**
 * Implements theme_preprocess_html().
 */
function paraneue_dosomething_preprocess_html(&$vars) {
  global $user;

  // Output any queued analytics events from `dosomething_helpers_add_analytics_event`:
  dosomething_helpers_attach_analytics_events();

  // Add theme stylesheet
  drupal_add_css(PARANEUE_PATH . '/dist/app.css', [
    'group' => CSS_THEME,
    'weight' => 0,
    'every_page' => TRUE,
    'preprocess' => FALSE
  ]);

  $vars['drupal_user_id'] = ! empty($user) ? $user->uid : '';
  $vars['csrf_token'] = drupal_get_token('services');

  // Used to print current tagged version in page source
  $vars['ds_version'] = variable_get('ds_version', '[dev]');

  // Checks if current site is an international affiliate
  $vars['is_affiliate'] = dosomething_settings_is_affiliate();
  $member_count = dosomething_user_get_member_count(TRUE);
  $vars['head_title'] = token_replace($vars['head_title'], ['member-count-readable' => $member_count]);

  $vars['use_google_tag_manager'] = theme_get_setting('use_google_tag_manager');

  $vars['enable_ad_tracking'] = FALSE;

  $update_url = variable_get('dosomething_settings_realtimefeed_update_url');
  drupal_add_js(
    array('dosomethingSetting' =>
      array(
        'globeUrl' => $update_url,
        'countryCode' => dosomething_settings_get_geo_country_code(),
      )
    ),
    'setting'
  );

}
