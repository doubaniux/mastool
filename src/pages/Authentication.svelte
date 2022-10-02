<script>
  import { navigate } from "svelte-navigator";
  import { RELATIONSHIP } from "../routes";
  import { authenticate } from "../auth";
  import { userLoggedIn } from "../store";

  let domain = localStorage.getItem("domain") || "";
  let error;

  let loading = false;
  const onSubmitClick = (e) => {
    e.preventDefault();
    authenticate(domain.toLowerCase()).catch((err) => {
      error = err;
      loading = false;
    });
    error = "";
    loading = true;
  };

  $: if ($userLoggedIn) {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    navigate(params.to || RELATIONSHIP);
  }
</script>

<section class="hero is-info">
  <div class="hero-body">
    <p class="title">向Mastool授权</p>
    <p>为了访问您的数据，请授权登录</p>
  </div>
</section>
<section class="section">
  <div class="columns is-mobile is-centered">
    <div class="column is-half-desktop">
      <form class="box">
        <div class="field">
          <label class="label">站点名</label>
          <div class="control">
            <input
              class="input"
              type="text"
              id="domain"
              placeholder="e.g. donotban.com"
              required
              bind:value={domain}
            />
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button
              class="button is-link is-info"
              class:is-loading={loading}
              disabled={loading}
              id="submit"
              on:click={onSubmitClick}
            >
              确认
            </button>
          </div>
        </div>

        {#if error}
          <div class="notification is-danger is-light">
            {error}
          </div>
        {/if}
      </form>
    </div>
  </div>
</section>
