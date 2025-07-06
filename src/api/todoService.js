import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // APIのベースURLを定義

/**
 * すべてのToDoタスクを取得します。
 * @returns {Promise<Object>} APIからのレスポンスデータ。
 */
export const getTasks = async () => {
  return await axios.get(`${API_BASE_URL}/get_user`);
};

/**
 * 新しいToDoタスクを追加します。
 * @param {Object} taskData - 追加するタスクのデータ (例: { text: '新しいタスク' })。
 * @returns {Promise<Object>} APIからのレスポンスデータ。
 */
export const addTask = async (taskData) => {
  return await axios.post(`${API_BASE_URL}/settask`, [taskData]);
};

/**
 * 特定のToDoタスクを削除します。
 * @param {string} id - 削除するタスクのID。
 * @returns {Promise<Object>} APIからのレスポンスデータ。
 */
export const deleteTask = async (id) => {
  return await axios.post(`${API_BASE_URL}/deletetask`, [{ id: id }]);
};
