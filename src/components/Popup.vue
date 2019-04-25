<template>
  <v-dialog max-width="600px" v-model="dialog">
    <v-btn flat slot="activator" class="success">Add New Project</v-btn>
    <v-card>
      <v-card-title>
        <h2>Add a new project</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field :rules="inputRules" label="Title" v-model="title" prepend-icon="folder"></v-text-field>
          <v-textarea :rules="inputRules" label="Information" v-model="content" prepend-icon="edit"></v-textarea>

          <v-menu v-model="menu" :close-on-content-click="false">
            <v-text-field slot="activator" :rules="inputRules" :value="formattedDate" clearable label="Due date" prepend-icon="date_range"></v-text-field>
            <v-date-picker v-model="due" @change="menu = false"></v-date-picker>
          </v-menu>

          <v-spacer></v-spacer>

          <v-btn flat class="success mx-0 mt-3" @click="submit" :loading="loading">Add project</v-btn>
          <v-alert :value="feedback" color="error" icon="warning" outline>
            {{ feedback }}
          </v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import format from 'date-fns/format';
import db from '@/fb';
import { auth } from '@/fb';

export default {
  data() {
    return {
      title: '',
      content: '',
      due: null,
      menu: false,
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
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        const project = {
          title: this.title,
          content: this.content,
          due: this.due,
          // due: format(this.due, 'Do MMM YYYY'),
          person: auth.currentUser.displayName,
          status: 'ongoing'
        }

        db.collection('projects')
          .add(project)
          .then(() => {
            this.loading = false;
            this.dialog = false;
            this.$emit('projectAdded', project.title);
          })
          .catch(error => {
            this.loading = false;
            this.feedback = error.message;
            console.log(error.message)
          });
      }
    }
  },
  computed: {
    formattedDate() {
      return this.due ? format(this.due, 'Do MMM YYYY') : ''
    }
  }
}
</script>

<style>

</style>
