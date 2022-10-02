<!-- Find the users that are following given user but not followed back. -->
<script>
  import { _ } from 'svelte-i18n';
  import {
    getFollowers,
    getFollowings,
    followUser,
    translateEmojis,
    unfollowUser,
  } from "../utils/mastodon";
  import { userData, accessToken } from "../store";
  import AsyncButton from "../components/AsyncButton.svelte";

  let loading = true,
    mapping = {},
    users = [],
    tab = "mutual",
    mutual,
    followingNotFollower,
    followerNotFollowing;

  Promise.all([
    getFollowers($userData.domain, $accessToken, $userData.id),
    getFollowings($userData.domain, $accessToken, $userData.id),
  ]).then(([followers, followings]) => {
    mutual = followers.filter((follower) =>
      followings.some((following) => following.acct === follower.acct)
    );
    followingNotFollower = followings.filter(
      (following) =>
        !followers.some((follower) => follower.acct === following.acct)
    );
    followerNotFollowing = followers.filter(
      (follower) =>
        !followings.some((following) => following.acct === follower.acct)
    );
    mapping = {
      mutual: mutual,
      followingNotFollower: followingNotFollower,
      followerNotFollowing: followerNotFollowing,
    };
    users = mapping[tab];
    loading = false;
  });

  $: users = mapping[tab];

  $: beforeButtonName = tab === "followerNotFollowing" ? $_('page.relationships_operation_button_follow', {default: 'Follow'}) : $_('page.relationships_operation_button_unfollow', {default: 'Unfollow'});

  const getOperationAsyncFunc = (id) => {
    if (tab === "mutual" || tab === "followingNotFollower") {
      return () => unfollowUser($userData.domain, $accessToken, id);
    } else if (tab === "followerNotFollowing") {
      return () => followUser($userData.domain, $accessToken, id);
    }
    throw new Error("Unknown tab");
  };
</script>

<section class="hero is-info">
  <div class="hero-body">
    <p class="title">{$_('page.relationships_hero_title', {default: 'Manage mutual relationships'})}</p>
  </div>
</section>
<section class="section">
  {#if loading}
    <div class="container is-flex is-justify-content-center py-6">
      <span class="spinner" />
    </div>
  {:else}
    <div class="tabs">
      <ul>
        <li
          class:is-active={tab === "mutual"}
          on:click={(e) => (tab = "mutual")}
        >
          <a>{$_('page.relationships_mutual_label', {default: 'Mutual'})}</a>
        </li>
        <li
          class:is-active={tab === "followingNotFollower"}
          on:click={(e) => (tab = "followingNotFollower")}
        >
          <a>{$_('page.relationships_following_label', {default: 'Following'})}</a>
        </li>
        <li
          class:is-active={tab === "followerNotFollowing"}
          on:click={(e) => (tab = "followerNotFollowing")}
        >
          <a>{$_('page.relationships_followers_label', {default: 'Followers'})}</a>
        </li>
      </ul>
    </div>
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>{$_('page.relationships_table_header_sequence', {default: 'Number'})}</th>
          <th>{$_('page.relationships_table_header_user', {default: 'User'})}</th>
          <th>{$_('page.relationships_table_header_operation', {default: 'Operation'})}</th>
        </tr>
      </thead>

      <tbody>
        {#each users as { acct, avatar, display_name, emojis, url, id }, i}
          <tr>
            <th>{i + 1}</th>
            <td>
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48 avatar">
                    {#key users}
                    <img src={avatar} alt={acct} />
                    {/key}
                  </figure>
                </div>
                <div class="media-content">
                  <a href={url} target="_blank">
                    <p class="title is-size-6">
                      {@html translateEmojis(display_name, emojis)}
                    </p>
                    <p class="subtitle is-size-6">@{acct}</p>
                  </a>
                </div>
              </div>
            </td>
            <td>
              {#key users}
                <AsyncButton
                  before={beforeButtonName}
                  during="{$_('page.relationships_operation_button_running', {default: 'Running...'})}"
                  success="{$_('page.relationships_operation_button_success', {default: '√ Success'})}"
                  failure="{$_('page.relationships_operation_button_failure', {default: 'Failed, please retry'})}"
                  asynFunc={getOperationAsyncFunc(id)}
                />
              {/key}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    {#if users.length === 0}
      <div class="container">
        <p class="content has-text-grey-light">{$_('page.relationships_no_user', {default: 'No result'})}</p>
      </div>
    {/if}
  {/if}
</section>

<style>
  .spinner {
    animation: spinAround 0.5s infinite linear;
    border: 4px solid #dbdbdb;
    border-radius: 9999px;
    border-right-color: transparent;
    border-top-color: transparent;
    content: "";
    display: block;
    height: 3em;
    width: 3em;
    position: relative;
  }
  .avatar {
    background-color: lightgray;
  }
  :global(.emoji) {
    height: 1em;
    position: relative;
    top: 3px;
  }

  @media only screen and (max-width: 1024px){
    .media {
      display: flex;
      flex-direction: column;
    }

    .media-content {
      margin-top: 0.5rem;
    }
  }
</style>
