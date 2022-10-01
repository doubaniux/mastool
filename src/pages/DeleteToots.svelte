<script>
  import { getStatusIdsByTimeRange, deleteStatus } from "../utils/mastodon";
  import { userData, accessToken } from "../store";

  let statusCount = null;

  const dateToDateInputValue = (date) =>
    date.getFullYear().toString().padStart(4, "0") +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getDate().toString().padStart(2, "0");

  let from = dateToDateInputValue(new Date(2000, 0, 1));
  let to = dateToDateInputValue(new Date());

  const isInputValid = (_from, _to) => new Date(_from) < new Date(_to);

  let isCounting = false;
  let ids = null;

  const onCountClick = (e) => {
    e.preventDefault();
    isCounting = true;
    isFinished = false;
    statusCount = null;
    getStatusIdsByTimeRange(
      $userData.domain,
      $accessToken,
      $userData.id,
      new Date(from + "T00:00"),
      new Date(to + "T23:59:59.999")
    )
      .then((_ids) => {
        statusCount = _ids.length;
        ids = _ids;
      })
      .finally(() => (isCounting = false));
  };

  let isDeleting = false;
  let isFinished = false;
  let deletionPercentage = 0;
  let deletionCount = 0

  const onDeleteClick = async (e) => {
    e.preventDefault();
    deletionPercentage = 0;
    deletionCount = 0;
    isDeleting = true;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      await deleteStatus($userData.domain, $accessToken, id);
      deletionCount += 1;
      deletionPercentage = ((100 * (i + 1)) / ids.length).toFixed(0);
    }
    isDeleting = false;
    isFinished = true;
  };
</script>

<section class="hero is-info">
  <div class="hero-body">
    <p class="title">Delete Toots</p>
  </div>
</section>
<section class="section">
  <div class="columns is-mobile is-centered">
    <div class="column is-half">
      <form class="box">
        <div class="field">
          <label class="label">From</label>
          <div class="control">
            <input
              class="input"
              type="date"
              name="from"
              required
              bind:value={from}
            />
          </div>
        </div>
        <div class="field">
          <label class="label">To</label>
          <div class="control">
            <input
              class="input"
              type="date"
              name="to"
              required
              bind:value={to}
            />
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button
              class="button is-info"
              on:click={onCountClick}
              disabled={!isInputValid(from, to) || isCounting || isDeleting}
              class:is-loading={isCounting}>Count statuses</button
            >
          </div>
          {#if isCounting}
            <div class="is-flex is-align-items-center">
              <span class="has-text-grey"
                >This may take a long time, please don't close this page</span
              >
            </div>
          {/if}
        </div>
        {#if statusCount !== null}
          {#if statusCount === 0}
            <div class="field">No status found in the interval.</div>
          {:else}
            <div class="field">
              {statusCount} status(es) found (including replies and direct messages).
              Are you sure you want to delete all of them?
            </div>
            <div class="field is-grouped">
              <div class="control">
                <button
                  class="button is-danger"
                  on:click={onDeleteClick}
                  class:is-loading={isDeleting}
                  disabled={isDeleting || isFinished}>Delete</button
                >
              </div>
              {#if isDeleting}
                <div class="is-flex is-align-items-center">
                  <span class="has-text-grey"
                    >Deleting (1 toot/min), don't close the page</span
                  >
                </div>
              {/if}
            </div>
            {#if isDeleting || isFinished}
              <div class="field is-grouped">
                <progress
                  class="progress is-info"
                  value={deletionPercentage}
                  max="100">{deletionPercentage}%</progress
                >
              </div>
            {/if}
            {#if isDeleting && !isFinished}
              <div class="field">
                {deletionPercentage}% ({deletionCount}/{ids.length})
              </div>
            {/if}
            {#if isFinished}
            <div class="field is-flex is-align-items-center mt-4">
              <span class="icon has-text-success mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  ><path
                    d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                  /></svg
                >
              </span>
              <span> <strong>Done.</strong></span>
            </div>
            {/if}
          {/if}
        {/if}
      </form>
    </div>
  </div>
</section>
