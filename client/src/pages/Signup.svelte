<script>
  import axios from "axios";
  import { user } from "../stores";
  import { push } from "svelte-spa-router";
  let username;
  let password;
  let errorMessage;
  $: if (username) {
    errorMessage = null;
  }
  async function signup() {
    try {
      const { data } = await axios.post("/api/auth/signup", {
        username,
        password,
      });
      $user = data.user;
      push("/dashboard");
    } catch (error) {
      if (error.response.data.message.name === "UserExistsError") {
        username = "";
        password = "";
        errorMessage = "Username is already taken";
      }
    }
  }
</script>

<div class="container">
  <div class="section">
    <h1 class="title">Sign Up</h1>
    <hr />
    <form on:submit|preventDefault={signup}>
      <div class="field">
        <label class="label" for="username">Username</label>
        <input
          type="text"
          bind:value={username}
          class="input"
          required
          class:is-danger={errorMessage}
          id="username" />
        {#if errorMessage}
          <p class="help is-danger">{errorMessage}</p>
        {/if}
      </div>
      <div class="field">
        <label class="label" for="password">Password</label>
        <input
          type="password"
          bind:value={password}
          class="input"
          required
          id="password" />
      </div>
      <div class="control">
        <button type="submit" class="button is-info is-light">Sign up</button>
      </div>
    </form>
  </div>
</div>
