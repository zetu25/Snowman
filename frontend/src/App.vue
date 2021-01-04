<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/zetu25/Snowman"
        target="_blank"
        text
      >
        <span class="mr-2">github repository</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <Grid/>
    </v-main>
  </v-app>
</template>

<script>
import Grid from './components/Grid';

export default {
  name: 'App',

  components: {
    Grid,
  },

  data: () => ({
    //
  }),
};
</script>
