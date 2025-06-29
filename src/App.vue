<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Vuetify ToDo アプリ</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-card class="mx-auto" max-width="600">
          <v-card-title class="headline">
            ToDo リスト
          </v-card-title>
          <v-card-text>
            <v-row align="center" class="mb-3">
              <v-col cols="9">
                <v-text-field
                  v-model="newTask"
                  label="新しいToDoを追加"
                  solo-inverted
                  flat
                  dense
                  hide-details
                  @keyup.enter="addTask"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-btn color="primary" @click="addTask" block>
                  追加
                </v-btn>
              </v-col>
            </v-row>

            <v-list flat>
              <v-list-item-group v-model="selected" multiple>
                <v-list-item v-for="(task, index) in tasks" :key="index">
                  <template v-slot:default="{ active }">
                    <v-list-item-action>
                      <v-checkbox
                        :input-value="active || task.done"
                        color="primary"
                        @click="toggleDone(task)"
                      ></v-checkbox>
                    </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title
                        :class="{ 'text-decoration-line-through': task.done }"
                      >
                        {{ task.text }}
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn icon @click.stop="deleteTask(index)">
                        <v-icon color="grey lighten-1">mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list>

            <v-card-actions v-if="tasks.length === 0">
              <v-spacer></v-spacer>
              <p class="text--disabled">ToDo がありません</p>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <v-footer app color="primary" dark>
      <v-spacer></v-spacer>
      <span>&copy; {{ new Date().getFullYear() }}</span>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    newTask: '',
    tasks: [
    ],
    selected: [], 
  }),
  methods: {
    addTask() {
      if (this.newTask.trim() === '') return;
      this.tasks.unshift({
        text: this.newTask,
        done: false,
      });
      this.newTask = ''; 
    },
    toggleDone(task) {
      task.done = !task.done;
    },
    deleteTask(index) {
      this.tasks.splice(index, 1);
    },
  },
};
</script>
