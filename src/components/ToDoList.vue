<template>
  <v-card class="mx-auto" max-width="600">
    <v-card-title class="headline">
      ToDo リスト
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        size="24"
        width="2"
        class="ml-3"
      ></v-progress-circular>
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
            :disabled="loading"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-btn color="primary" @click="addTask" block :disabled="loading">
            追加
          </v-btn>
        </v-col>
      </v-row>

      <v-list flat>
        <v-list-item v-for="task in tasks" :key="task.id">
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
              <v-btn icon @click.stop="deleteTask(task.id)">
                <v-icon color="grey lighten-1">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>

      <v-card-actions v-if="!loading && tasks.length === 0">
        <v-spacer></v-spacer>
        <p class="text--disabled">ToDo がありません</p>
        <v-spacer></v-spacer>
      </v-card-actions>
      <v-card-actions v-if="loading">
        <v-spacer></v-spacer>
        <p class="text--disabled">データを読み込み中...</p>
        <v-spacer></v-spacer>
      </v-card-actions>

      <v-alert v-if="error" type="error" dense outlined class="mt-3">
        {{ error }}
      </v-alert>

    </v-card-text>
  </v-card>
</template>

<script>
import * as todoService from '@/api/todoService';

export default {
  name: 'TodoList',
  data: () => ({
    newTask: '',
    tasks: [],
    loading: false,
    error: null,
  }),
  async created() {
    await this.fetchTasks();
  },
  methods: {
    // バックエンドからToDoリストを取得する非同期メソッド
    async fetchTasks() {
      this.loading = true;
      this.error = null;
      try {
        const response = await todoService.getTasks();
        const fetchedTasks = Object.keys(response.data).map(id => {
          const taskData = response.data[id];
          return {
            id: id,
            text: taskData.task_text,
            done: taskData.completed
          };
        });
        this.tasks = fetchedTasks;
      } catch (err) {
        console.error("ToDoデータの取得に失敗しました:", err);
        this.error = "ToDoデータの取得に失敗しました。サーバーが起動しているか確認してください。";
      } finally {
        this.loading = false;
      }
    },
    // 新しいToDoを追加するメソッド
    async addTask() {
      if (this.newTask.trim() === '') return;

      this.loading = true;
      this.error = null;

      try {
        const response = await todoService.addTask({ text: this.newTask });
        if (response.status === 201) {
          this.newTask = '';
          await this.fetchTasks();
        } else {
          this.error = "タスクの追加に失敗しました。";
          console.error("タスク追加APIからの予期せぬレスポンス:", response.status);
        }
      } catch (err) {
        console.error("タスクの追加に失敗しました:", err);
        this.error = "タスクの追加に失敗しました。ネットワーク接続またはサーバーを確認してください。";
      } finally {
        this.loading = false;
      }
    },
    // ToDoの完了状態を切り替えるメソッド
    toggleDone(task) {
      task.done = !task.done;
    },
    // ToDoを削除するメソッド
    async deleteTask(idToDelete) {
      this.loading = true;
      this.error = null;

      try {
        const response = await todoService.deleteTask(idToDelete);
        if (response.status === 204) {
          await this.fetchTasks();
        } else if (response.status === 404) {
          this.error = "削除対象のタスクが見つかりませんでした。";
          console.error("タスク削除API: タスクが見つかりません。", idToDelete);
        } else {
          this.error = "タスクの削除に失敗しました。";
          console.error("タスク削除APIからの予期せぬレスポンス:", response.status);
        }
      } catch (err) {
        console.error("タスクの削除に失敗しました:", err);
        this.error = "タスクの削除に失敗しました。ネットワーク接続またはサーバーを確認してください。";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>