<template>
  <v-dialog max-width="600px" v-model="dialog">
    <v-btn flat slot="activator" class="success">Login</v-btn>
    <v-card>
      <v-card-title>
        <h2>Login</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field :rules="inputRules" label="Email" v-model="email" prepend-icon="mail"></v-text-field>
          <v-text-field type="password" :rules="inputRules" label="Password" v-model="password" prepend-icon="lock"></v-text-field>

          <v-spacer></v-spacer>

          <v-btn flat class="success mx-0 mt-3" @click="login" :loading="loading">Enter</v-btn>
          <v-alert :value="feedback" color="error" icon="warning" outline>
            {{ feedback }}
          </v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { db, auth } from '@/fb';

export default {
  data() {
    return {
      email: '',
      password: '',
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
    login() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        auth.signInWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            this.email = '';
            this.password = '';
            this.loading = false;
            this.dialog = false;
            this.feedback = '';
            this.$emit('userLogin', cred.user);
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
