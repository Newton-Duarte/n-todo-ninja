<template>
  <nav>

    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>{{ snackMessage }}</span>
      <v-btn color="white" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>

    <v-toolbar flat app>
      <v-toolbar-side-icon v-if="user" class="grey--text" @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Todo</span>
        <span>Ninja</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
      <!-- dropdown menu -->
      <v-menu offset-y v-if="user">
        <v-btn flat slot="activator" color="grey">
          <v-icon left>expand_more</v-icon>
          <span>Menu</span>
        </v-btn>
        <v-list>
          <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
            <v-list-tile-title>{{ link.text }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <Signup v-if="!user" />
      <Login v-if="!user" @userLogin="userLogin" />

      <v-btn v-if="user" @click="logout" flat color="grey">
        <span>Sign Out</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer v-if="user" v-model="drawer" app class="primary">
      <v-layout column align-center>
        <v-flex class="mt-5">
          <v-avatar size="100">
            <img src="/avatar-1.png">
          </v-avatar>
          <p class="white--text subheading mt-1 text-xs-center">
            {{ user.displayName }}
          </p>
        </v-flex>
        <v-flex class="mt-4 mb-3">
          <Popup @projectAdded="projectAdded" />
        </v-flex>
      </v-layout>
      <v-list>
        <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-tile-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="white--text">{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import Login from './Login';
import Signup from './Signup';
import Popup from './Popup';
import { auth } from '@/fb';
import db from '@/fb';

export default {
  components: { Popup, Login, Signup },
  data() {
    return {
      user: null,
      drawer: false,
      snackbar: false,
      snackMessage: '',
      links: [
        { icon: 'dashboard', text: 'Dashboard', route: '/dashboard' },
        { icon: 'folder', text: 'My Projects', route: '/projects' },
        { icon: 'person', text: 'Team', route: '/team' }
      ]
    }
  },
  methods: {
    userLogin(payload) {
      this.snackbar = true;
      this.snackMessage = `User: (${payload.email}) logged in with success!`;
    },
    logout() {
      auth.signOut().then(() => {
        this.snackbar = true;
        this.snackMessage = `User logged out with success!`;
        this.$router.push({ name: 'home' });
      });
    },
    projectAdded(payload) {
      this.snackbar = true;
      this.snackMessage = `Project: ${payload} created!`;
    }
  },
  created() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        if (!user.displayName) {
          db.collection('users').doc(user.uid).get()
            .then(doc => {
              if (doc.exists) {
                user.updateProfile({
                  displayName: doc.data().name
                });
              }
            });
        }
      } else {
        this.user = null;
      }
    })
  }
}
</script>

<style>

</style>
