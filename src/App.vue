<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Vuetify ToDo アプリ</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <TodoList />
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
import TodoList from './components/ToDoList.vue';

export default {
  name: 'App',
  components: {
    TodoList,
  },
};
</script>