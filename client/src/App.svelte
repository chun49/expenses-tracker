<script>
  import axios from "axios";
  import { onMount } from "svelte";
  let input = 0;
  let typeOfTransaction = "+";
  let transactions = [];
  onMount(async () => {
    const { data } = await axios.get("/api/transactions/");
    transactions = data;
  });
  const addTransaction = async () => {
    const transaction = {
      date: new Date().getTime(),
      value: typeOfTransaction === "+" ? input : input * -1,
    };
    const response = await axios.post("/api/transactions", transaction);
    transactions = [response.data, ...transactions];
    input = 0;
  };
  const removeTransaction = async (id) => {
    const response = await axios.delete("/api/transactions/" + id);
    if (response.data.id === id) {
      transactions = transactions.filter((t) => t.id !== id);
    }
  };
</script>

<style>
  .app {
    margin: 40px auto;
    max-width: 500px;
  }
</style>

<div class="app container">
  <div class="field has-addons">
    <p class="control">
      <span class="select">
        <select bind:value={typeOfTransaction}>
          <option value="+">+</option>
          <option value="-">-</option>
        </select>
      </span>
    </p>
    <p class="control is-expanded">
      <input
        class="input"
        type="number"
        bind:value={input}
        placeholder="Amount of money" />
    </p>
    <p class="control">
      <button class="button" on:click={addTransaction}>Save</button>
    </p>
  </div>
  {#each transactions as transaction (transaction._id)}
    <div class="notification">
      {transaction.value}
      <button
        class="delete"
        on:click={() => removeTransaction(transaction._id)}>x</button>
    </div>
  {/each}
</div>
