<script>
  import Logo from "../assets/logo.svg";
  import Github from "../assets/github.svg";
  import { Link, link } from "svelte-navigator";
  import { RELATIONSHIP } from "../routes";

  let menuActive = false;
  const toggleBurger = () => {
    menuActive = !menuActive;
  };
</script>

<nav class="navbar py-2 px-1" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/" use:link>
      <img src={Logo} alt="Mastodon Tool" />
    </a>

    <button
      role="button"
      class="navbar-burger"
      class:is-active={menuActive}
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

  <div id="navbarMenu" class="navbar-menu ml-5" class:is-active={menuActive}>
    <div class="navbar-start">
      <a class="navbar-item is-flex is-align-items-center" href="https://github.com/doubaniux/mastool" target="_blank"> 
        GitHub
        <span class="icon is-small ml-1">
          <img src={Github} alt="GitHub" class="github">
        </span>
      </a>

      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link"> 功能列表 </a>

        <div class="navbar-dropdown">
          <Link to={RELATIONSHIP} class="navbar-item">
            互关管理
          </Link>
        </div>
      </div>
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
