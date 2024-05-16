<template>
     <v-footer
      dark
      height="auto"
    >
      <v-card
        class="flex"
        flat
        tile
        :color="$root.themeColorFooter"
      >
        <v-card-actions class="black--text justify-center">
          &copy;copyright 2024 by I.P.One Co., Ltd.
        </v-card-actions>
      </v-card>
    </v-footer>
</template>

<script>
export default {
  data() {
    return {
      icons: [
        'fab fa-facebook',
        'fab fa-twitter',
        'fab fa-google-plus',
        'fab fa-linkedin',
        'fab fa-instagram'
      ]
    }
  }
}
</script>

<style>

</style>
