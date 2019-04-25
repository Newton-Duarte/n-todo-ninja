<template>
  <v-dialog max-width="600px" v-model="dialog">
    <v-btn flat color="grey" slot="activator">
      <span>Sign Up</span>
      <v-icon right>person_add</v-icon>
    </v-btn>
    <v-card>
      <v-card-title>
        <h2>Sign Up</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field :rules="inputRules" label="Name" v-model="name" prepend-icon="person"></v-text-field>
          <v-text-field :rules="inputRules" label="Email" v-model="email" prepend-icon="mail"></v-text-field>
          <v-text-field type="password" :rules="inputRules" label="Password" v-model="password" prepend-icon="lock"></v-text-field>
          <v-textarea :rules="inputRules" label="Biography" v-model="bio" prepend-icon="person"></v-textarea>

          <v-spacer></v-spacer>

          <v-btn flat class="success mx-0 mt-3" @click="signup" :loading="loading">Sign Up</v-btn>
          <v-alert :value="feedback" color="error" icon="warning" outline>
            {{ feedback }}
          </v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { auth } from '@/fb';
import db from '@/fb';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      bio: '',
      inputRules: [
        v => !!v || 'This field is required',
        v => v.length >= 3 || 'Minimum length is 3 characters'
      ],
      dialog: false,
      loading: false,
      feedback: ''
    }
  },
  methods: {
    signup() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        auth.createUserWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            return db.collection('users').doc(cred.user.uid).set({
              name: this.name,
              email: this.email,
              bio: this.bio
            });
          }).then(() => {
            this.email = '';
            this.password = '';
            this.loading = false;
            this.dialog = false;
            this.feedback = '';
            this.$router.push({ name: 'dashboard' });
          }).catch(err => {
            this.loading = false;
            this.feedback = err.message;
          });
      }
    }
  }
}
</script>

<style>

</style>
