<script>
  import { _ } from "svelte-i18n";
  import Logo from "../assets/logo.svg";
  import Github from "../assets/github.svg";
  import { Link, link } from "svelte-navigator";
  import I18nSelection from "./I18nSelection.svelte";
  import { RELATIONSHIP, DELETE_TOOTS } from "../routes";
  import { logout } from "../auth";
  import { userLoggedIn } from "../store";

  let isMenuActive = false;
  const toggleBurger = () => {
    isMenuActive = !isMenuActive;
  };

  let isListDropdownOpen = false;
  const toggleDropdown = () => {
    isListDropdownOpen = !isListDropdownOpen;
  };

  const onLogoutClick = (e) => {
    e.preventDefault();
    logout();
  };
</script>

<nav class="navbar py-2 px-1" role="navigation" aria-label="main navigation">
  <div class="navbar-brand mr-5">
    <a class="navbar-item" href="/" use:link>
      <img src={Logo} alt="Mastodon Tool" />
    </a>

    <button
      role="button"
      class="navbar-burger"
      class:is-active={isMenuActive}
      aria-label="menu"
      aria-expanded="false"
      data-target="navbarMenu"
      on:click={toggleBurger}
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </button>
  </div>

  <div id="navbarMenu" class="navbar-menu" class:is-active={isMenuActive}>
    <div class="navbar-start">
      <a
        class="navbar-item is-flex is-align-items-center"
        href="https://github.com/doubaniux/mastool"
        target="_blank"
      >
        GitHub
        <span class="icon is-small ml-1">
          <img src={Github} alt="GitHub" class="github" />
        </span>
      </a>

      <div
        class="navbar-item has-dropdown"
        class:is-active={isListDropdownOpen}
        on:click={toggleDropdown}
      >
        <a class="navbar-link"
          >{$_("component.feature_list_title", { default: "Feature list" })}</a
        >
        {#if isListDropdownOpen}
          <div class="navbar-dropdown">
            <Link to={RELATIONSHIP} class="navbar-item"
              >{$_("component.mutual_relationship", {
                default: "Manage mutual relationships",
              })}</Link
            >
            <Link to={DELETE_TOOTS} class="navbar-item"
              >{$_("component.delete_toots", { default: "Delete toots" })}</Link
            >
          </div>
        {/if}
      </div>
    </div>
    <div class="navbar-end">
      {#if $userLoggedIn}
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-light" on:click={onLogoutClick}>
              {$_("component.log_out", { default: "Log out" })}
            </a>
          </div>
        </div>
        <div class="navbar-item">
          <I18nSelection/>
        </div>
      {/if}
    </div>
  </div>
</nav>

<style>
  img {
    height: 36px;
  }

  .github {
    height: 1em;
  }
</style>
