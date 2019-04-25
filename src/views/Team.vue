<template>
  <div class="team">
    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>{{ snackMessage }}</span>
      <v-btn color="white" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-container class="my-5">
      <h1 class="subheading grey--text">Team</h1>
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="(user, index) in users" :key="index">
          <v-card flat class="text-xs-center ma-3">
            <!-- <v-responsive class="pt-4">
              <v-avatar size="100" class="grey lighten-2">
                <img :src="user.avatar">
              </v-avatar>
            </v-responsive> -->
            <v-card-text>
              <div class="subheading">{{ user.name }}</div>
              <div class="grey--text">{{ user.email }}</div>
              <div class="grey--text">{{ user.role }}</div>
              <div class="grey--text">{{ user.bio }}</div>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn @click="makeAdmin(user)" flat color="grey">
                <v-icon small left>create</v-icon>
                <span>Make Admin</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import db from '@/fb';
import { auth } from '@/fb';
import { functions } from '@/fb';

export default {
  data() {
    return {
      users: [],
      user: null,
      snackbar: false,
      snackMessage: ''
    }
  },
  methods: {
    makeAdmin(user) {
      if (this.user.role == 'admin') {
        const addAdminRole = functions.httpsCallable('addAdminRole');
        addAdminRole({ email: user.email })
          .then(result => {
            this.snackbar = true;
            this.snackMessage = result.message;    
          });
      } else {
        this.snackbar = true;
        this.snackMessage = 'Sorry, only a true master ninja can make this action.';
      }
    }
  },
  created() {
    this.user = auth.currentUser;

    db.collection('users').onSnapshot(res => {
      const changes = res.docChanges();

      changes.forEach(change => {
        if (change.type === 'added') {
          this.users.push({
            ...change.doc.data(),
            id: change.doc.id
          });
        }
      });
    });
  }
}
</script>

<style>

</style>
