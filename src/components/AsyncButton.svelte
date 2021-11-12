<script>
  export let before;
  export let during;
  export let success;
  export let failure;
  export let asynFunc;

  let clicked = false;
  let promise;

  const onClick = (e) => {
    e.preventDefault();
    clicked = true;
    promise = asynFunc();
  };
</script>

{#if !clicked}
  <button on:click={onClick} class="button is-text">
    {before}
  </button>
{:else}
  {#await promise}
    <button class="button is-text has-text-grey-light" disabled>
      {during}
    </button>
  {:then result}
    <button class="button is-text has-text-success" disabled>{success}</button>
  {:catch error}
    <button class="button is-text has-text-danger" on:click={onClick}>
      {failure}
    </button>
  {/await}
{/if}
