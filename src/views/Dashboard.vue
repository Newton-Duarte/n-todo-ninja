<template>
  <div class="dashboard">
    <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
      <span>{{ snackMessage }}</span>
      <v-btn color="white" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-container v-if="projects.length" class="my-5">
      <h1 class="subheading grey--text">Dashboard</h1>
      <v-layout row justify-start class="mb-3">
        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortBy('title')" slot="activator">
            <v-icon small left>folder</v-icon>
            <span class="caption text-lowercase">By project</span>
          </v-btn>
          <span>Sort projects by title</span>
        </v-tooltip>

        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortBy('person')" slot="activator">
            <v-icon small left>person</v-icon>
            <span class="caption text-lowercase">By person</span>
          </v-btn>
          <span>Sort projects by person</span>
        </v-tooltip>
      </v-layout>

      <v-card v-for="project in projects" :key="project.id" flat>
        <v-layout row wrap :class="`pa-3 project ${project.status}`">
          <v-flex xs12 md4>
            <div class="caption grey--text">Project title</div>
            <div>{{ project.title }}</div>
          </v-flex>
          <v-flex xs6 md2>
            <div class="caption grey--text">Person</div>
            <div>{{ project.person }}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption grey--text">Due by</div>
            <div>{{ formatDate(project.due) }}</div>
          </v-flex>
          <v-flex xs2>
            <div class="right">
              <v-chip small :class="`${project.status} white--text caption my-2`">
                {{ project.status }}
              </v-chip>
            </div>
          </v-flex>
          <v-flex v-if="project.person == user.displayName" xs2>
            <v-card-actions class="right">
              <v-btn @click="edit(project)" icon>
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn @click="remove(project)" icon>
                <v-icon>delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card>
    </v-container>

    <v-container v-else>
      <v-layout row wrap justify-center align-center>
        <v-flex xs4>
          <v-card>
            <v-responsive>
              <v-img
                contain
                src="ninja-no-projects.png"
              ></v-img>
            </v-responsive>

            <v-card-title primary-title>
              <h3 class="headline ma-auto">Looks like you have no projects</h3>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-actions>
              <Popup class="ma-auto" @projectAdded="projectAdded" />
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog max-width="600px" v-model="dialog">
      <v-card>
        <v-card-title>
          <h2>Edit project</h2>
        </v-card-title>
        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-text-field :rules="inputRules" label="Title" v-model="editedProject.title" prepend-icon="folder"></v-text-field>
            <v-textarea :rules="inputRules" label="Information" v-model="editedProject.content" prepend-icon="edit"></v-textarea>

            <v-menu full-width v-model="menu" :close-on-content-click="false">
              <v-text-field slot="activator" :rules="inputRules" :value="formattedDate" clearable label="Due date" prepend-icon="date_range"></v-text-field>
              <v-date-picker v-model="editedProject.due" @change="menu = false"></v-date-picker>
            </v-menu>

            <v-select
              :items="status"
              label="Status"
              v-model="editedProject.status"
              prepend-icon="label_important"
            ></v-select>

            <v-spacer></v-spacer>

            <v-btn flat class="success mx-0 mt-3" @click="submit" :loading="loading">Update project</v-btn>
            <v-alert :value="feedback" color="error" icon="warning" outline>
              {{ feedback }}
            </v-alert>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>



  </div>
</template>

<script>
import db from '@/fb';
import { auth } from '@/fb';
import format from 'date-fns/format';
import Popup from '@/components/Popup';

  export default {
    name: 'Dashboard',
    components: {
      Popup
    },
    data() {
      return {
        user: null,
        projects: [],
        status: ['ongoing', 'complete', 'overdue'],
        editedProject: {
          title: '',
          content: '',
          due: null
        },
        dialog: false,
        snackbar: false,
        snackMessage: '',
        menu: false,
        loading: false,
        feedback: '',
        inputRules: [
          v => !!v || 'This field is required',
          v => v.length >= 3 || 'Minimum length is 3 characters'
        ],
      }
    },
    methods: {
      submit() {
        if (this.$refs.form.validate()) {
          this.loading = true;

          db.collection('projects')
            .doc(this.editedProject.id)
            .update(this.editedProject)
            .then(() => {
              this.loading = false;
              this.dialog = false;
              this.snackbar = true;
              this.projects.find(project => {
                if (project.id === this.editedProject.id) {
                  let pIndex = this.projects.indexOf(project);
                  this.projects[pIndex] = this.editedProject;
                }
              });
              this.snackMessage = `Project: ${this.editedProject.title} updated!`;
            })
            .catch(error => {
              this.loading = false;
              this.feedback = error.message;
            });
        }
      },
      sortBy(prop) {
        this.projects.sort((a,b) => a[prop] < b[prop] ? -1 : 1);
      },
      edit(project) {
        this.editedIndex = this.projects.indexOf(project);
        this.editedProject = Object.assign({}, project);
        this.dialog = true;
      },
      remove(project) {
        if (confirm(`Remove project: ${project.title}?`)) {
          db.collection('projects').doc(project.id)
            .delete()
            .then(() => {
              let index = this.projects.indexOf(project);
              this.projects.splice(index, 1);
              this.snackbar = true;
              this.snackMessage = `Project: (${project.title}) removed.`;
            })
            .catch(error => {
              this.snackbar = true;
              this.snackMessage = `Project: (${project.title}) couldn't be removed. ${error.message}`;
            });
        } else {
          return;
        }
      },
      formatDate(date) {
        return format(date, 'Do MMM YYYY');
      },
      projectAdded(payload) {
        this.snackbar = true;
        this.snackMessage = `Project: ${payload} created!`;
      }
    },
    created() {
      this.user = auth.currentUser || null;

      db.collection('projects').onSnapshot(res => {
        const changes = res.docChanges();

        changes.forEach(change => {
          if (change.type === 'added') {
            this.projects.push({
              ...change.doc.data(),
              id: change.doc.id
            });
          }
        });
      });
    },
    computed: {
      formattedDate() {
        return this.editedProject.due ? format(this.editedProject.due, 'Do MMM YYYY') : ''
      }
    }
  }
</script>
<style>
  .project.complete {
    border-left: 4px solid #3cd1c2;
  }
  .project.ongoing {
    border-left: 4px solid orange;
  }
  .project.overdue {
    border-left: 4px solid tomato;
  }
  .v-chip.complete {
    background: #3cd1c2;
  }
  .v-chip.ongoing {
    background: #ffaa2c;
  }
  .v-chip.overdue {
    background: #f83e70;
  }
</style>
