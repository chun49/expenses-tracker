<script>
    import axios from "axios";
    import { onMount } from "svelte";
    import SummaryCard from "../components/SummaryCard.svelte";
    import Transaction from "../components/Transaction.svelte";
    import Loading from "../components/Loading.svelte";
    import {
      sortedTransactions,
      transactions,
      expenses,
      balance,
      income,
    } from "../stores";
    let input = 0;
    let typeOfTransaction = "+";
    let loading = false;
    $: disabled = !input;
  
    onMount(async () => {
      loading = true;
      const { data } = await axios.get("/api/transactions/");
      $transactions = data;
      loading = false;
    });
    const addTransaction = async () => {
      const transaction = {
        date: new Date().getTime(),
        value: typeOfTransaction === "+" ? input : input * -1,
      };
      const response = await axios.post("/api/transactions", transaction);
      $transactions = [response.data, ...$transactions];
      input = 0;
    };
    const removeTransaction = async (id) => {
      const response = await axios.delete("/api/transactions/" + id);
      if (response.data.id === id) {
        $transactions = $transactions.filter((t) => t._id !== id);
      }
    };
  </script>
  
  <style>
    .app {
      margin: 40px auto;
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
        <button class="button" on:click={addTransaction} {disabled}>Save</button>
      </p>
    </div>
    {#if loading}
      <Loading />
    {/if}
  
    {#if $transactions.length > 0}
      <SummaryCard mode="balance" value={$balance} />
      <div class="columns">
        <div class="column">
          <SummaryCard mode="income" value={$income} />
        </div>
        <div class="column">
          <SummaryCard mode="expenses" value={$expenses} />
        </div>
      </div>
      <hr />
    {:else if !loading}
      <div class="notification">Add Your Transactions</div>
    {/if}
  
    {#each $sortedTransactions as transaction (transaction._id)}
      <Transaction {transaction} {removeTransaction} />
    {/each}
  </div>
  