<template>
    <div class="loading">
        <img src="@/assets/loading.gif" alt="Loading">
    </div>
</template>

<script>
export default {
    name: 'Loading'
}
</script>

<style>
    .loading {
        grid-area: content;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
