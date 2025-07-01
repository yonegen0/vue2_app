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
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-btn color="primary" @click="addTask" block>
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
import axios from 'axios';

export default {
  name: 'App',
  data: () => ({
    newTask: '', // 新しいToDoの入力値を保持
    tasks: [], // ToDoリストのタスク
    loading: false, // API呼び出し中のローディング状態を管理
    error: null,    // API呼び出し時のエラーメッセージを保持
  }),
  // コンポーネントが作成された後（DOMにマウントされる前）にAPIを呼び出す
  async created() {
    await this.fetchTasks();
  },
  methods: {
    // バックエンドからToDoリストを取得する非同期メソッド
    async fetchTasks() {
      this.loading = true; // ローディング開始
      this.error = null;   // 前回のエラーをリセット
      try {
        // Todoリスト取得
        const response = await axios.get('http://localhost:5000/get_user');

        const fetchedTasks = Object.keys(response.data).map(id => {
          const taskData = response.data[id];
          return {
            id: id, // バックエンドからのIDを保持
            text: taskData.task_text, // task_textをtextにマッピング
            done: taskData.completed  // completedをdoneにマッピング
          };
        });
        this.tasks = fetchedTasks; // 変換したデータでtasksを更新
      } catch (err) {
        console.error("ToDoデータの取得に失敗しました:", err);
        this.error = "ToDoデータの取得に失敗しました。サーバーが起動しているか確認してください。";
      } finally {
        this.loading = false; // ローディング終了
      }
    },
    // 新しいToDoを追加するメソッド
    addTask() {
      if (this.newTask.trim() === '') return;
      this.tasks.unshift({
        // 新しいタスクには一時的なIDを付与
        id: Date.now().toString(),
        text: this.newTask,
        done: false,
      });
      this.newTask = ''; // 入力フィールドをクリア
    },
    // ToDoの完了状態を切り替えるメソッド
    toggleDone(task) {
      task.done = !task.done; // taskオブジェクトのdoneプロパティを反転
    
    },
    // ToDoを削除するメソッド
    deleteTask(idToDelete) {
      // 削除したいIDを持つタスクを除外して新しい配列を作成
      this.tasks = this.tasks.filter(task => task.id !== idToDelete);
    
    },
  },
};
</script>