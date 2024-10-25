export const COMMON_FEATURES = {
  articles_preview_enabled: true,
  c9s_tweet_anatomy_moderator_badge_enabled: true,
  communities_web_enable_tweet_community_results_fetch: true,
  creator_subscriptions_quote_tweet_preview_enabled: false,
  creator_subscriptions_tweet_preview_api_enabled: true,
  freedom_of_speech_not_reach_fetch_enabled: true,
  graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
  longform_notetweets_consumption_enabled: true,
  longform_notetweets_inline_media_enabled: true,
  longform_notetweets_rich_text_read_enabled: true,
  responsive_web_edit_tweet_api_enabled: true,
  responsive_web_enhance_cards_enabled: false,
  responsive_web_graphql_exclude_directive_enabled: true,
  responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
  responsive_web_graphql_timeline_navigation_enabled: true,
  responsive_web_twitter_article_tweet_consumption_enabled: true,
  rweb_tipjar_consumption_enabled: true,
  rweb_video_timestamps_enabled: true,
  standardized_nudges_misinfo: true,
  tweet_awards_web_tipping_enabled: false,
  tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
  tweetypie_unmention_optimization_enabled: true,
  verified_phone_label_enabled: false,
  view_counts_everywhere_api_enabled: true,
};

export const BOOKMARK_FEATURES = {
  ...COMMON_FEATURES,
  graphql_timeline_v2_bookmark_timeline: true,
};

export const LIKE_FEATURES = {
  ...COMMON_FEATURES,
};

export const USER_FEATURES = {
  ...COMMON_FEATURES,
  responsive_web_home_pinned_timelines_enabled: true,
  blue_business_profile_image_shape_enabled: true,
  hidden_profile_likes_enabled: true,
  highlights_tweets_tab_ui_enabled: true,
  interactive_text_enabled: true,
  longform_notetweets_richtext_consumption_enabled: true,
  profile_foundations_tweet_stats_enabled: true,
  profile_foundations_tweet_stats_tweet_frequency: true,
  responsive_web_birdwatch_note_limit_enabled: true,
  responsive_web_media_download_video_enabled: false,
  responsive_web_text_conversations_enabled: false,
  responsive_web_twitter_article_data_v2_enabled: true,
  responsive_web_twitter_blue_verified_badge_is_enabled: true,
  rweb_lists_timeline_redesign_enabled: true,
  spaces_2022_h2_clipping: true,
  spaces_2022_h2_spaces_communities: true,
  subscriptions_verification_info_verified_since_enabled: true,
  vibe_api_enabled: true,
};
