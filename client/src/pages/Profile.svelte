<script>
  import axios from "axios";
  let oldPassword;
  let newPassword;
  let errorMessage;
  let successMessage;
  $: if (oldPassword) {
    errorMessage = null;
  }
  async function changePassword() {
    try {
      await axios.post("/api/auth/update-password", {
        oldPassword,
        newPassword,
      });
      oldPassword = "";
      newPassword = "";
      successMessage = "Password was updated correctly";
    } catch (error) {
      if (error.response.data.message.name === "IncorrectPasswordError") {
        successMessage = false
        oldPassword = "";
        newPassword = "";
        errorMessage = "Wrong old password";
      }
    }
  }
</script>

<div class="container">
  <div class="section">
    <h1 class="title">Change Password</h1>
    {#if successMessage}
    <div class="notification is-success is-light">
      <p class="help is-success">{successMessage}</p>
    </div>
     
    {/if}
    <hr />
    <form on:submit|preventDefault={changePassword}>
      <div class="field">
        <label class="label" for="oldPassword">Old Password</label>
        <input
          type="password"
          bind:value={oldPassword}
          class="input"
          required
          class:is-danger={errorMessage}
          id="oldPassword" />
        {#if errorMessage}
          <p class="help is-danger">{errorMessage}</p>
        {/if}
      </div>
      <div class="field">
        <label class="label" for="newPassword">New Password</label>
        <input
          type="password"
          bind:value={newPassword}
          class="input"
          required
          id="newPassword" />
      </div>
      <div class="control">
        <button type="submit" class="button is-info is-light">Sign up</button>
      </div>
    </form>
  </div>
</div>
