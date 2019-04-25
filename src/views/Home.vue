<template>
  <v-container fluid class="home">
    <v-layout row wrap justify-center align-center>
      <v-card>
        <v-responsive>
          <v-img
            contain
            src="ninja.png"
            aspect-ratio="2.75"
          ></v-img>
        </v-responsive>

        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-1 text-xs-center">
              Welcome to 
              <span class="font-weight-light">Todo</span>
              <span>Ninja</span>
            </h3>
            <div>Having trouble tracking your duties, ninja? Have no fear, TodoNinja is here!</div>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-actions>
          <p class="caption ma-auto">You can find the buttons to <span class="font-weight-bold">Sign Up</span> and <span class="font-weight-bold">Login</span> on the navigation bar.</p>
        </v-card-actions>
      </v-card>
    </v-layout>
    <v-layout column justify-center align-center>
      <footer>
        <div>This project was created based on the <a href="https://www.youtube.com/watch?v=2uZYKcKHgU0&list=PL4cUxeGkcC9g0MQZfHwKcuB0Yswgb3gA5" target="_blank">Vuetify Tutorial</a> from <a href="https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg/featured" target="_blank">The Net Ninja</a></div>
        <div class="caption text-xs-center">Coded by Newton Duarte</div>
      </footer>
    </v-layout>
  </v-container>
</template>

<script>
export default {

}
</script>

<style scoped>
  .home {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
