<script>
  import { translateEmojis } from "../utils/mastodon";
  export let avatar;
  export let acct;
  export let display_name;
  export let note;
  export let url;
  export let emojis;
  export let operationName;
  export let operationFunc;

  let clicked = false;
  let promise;

  const onClick = (e) => {
    e.preventDefault();
    clicked = true;
    promise = operationFunc();
  };
</script>

<div class="card mb-4">
  <div class="card-content">
    <div class="media">
      <div class="media-left">
        <figure class="image is-48x48">
          <img src={avatar} alt={acct} />
        </figure>
      </div>
      <div class="media-content">
        <a href={url} target="_blank">
          <p class="title is-4">
            {@html translateEmojis(display_name, emojis)}
          </p>
          <p class="subtitle is-6">@{acct}</p>
        </a>
      </div>
    </div>
    <div class="content">
      {@html translateEmojis(note, emojis)}
    </div>
  </div>
  <div class="card-footer is-justify-content-center">
    {#if !clicked}
      <button on:click={onClick} class="button is-ghost">
        {operationName}
      </button>
    {:else}
      {#await promise}
        <button class="button is-ghost ghost has-text-grey-light" disabled>操作中...</button>
      {:then result}
        <button class="button is-ghost ghost has-text-success" disabled>√成功</button>
      {:catch error}
        <button class="button is-ghost has-text-danger" on:click={onClick}>操作失败，请重试</button>
      {/await}
    {/if}
  </div>
</div>

<style>
  :global(.emoji) {
    height: 1em;
    position: relative;
    top: 3px;
  }
  .ghost {
    text-decoration: none !important;
    border: none !important;
  }

  button {
    width: 100%;
  }
</style>
