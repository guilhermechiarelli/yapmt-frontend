<template>
  <div class="container">
    <header>
      <h3>{{ projectName }}</h3>
      <div>
        <span>
          {{ summary.completed }} / {{ summary.late }} / {{ summary.total }}
        </span>
        <Button
          :clickFunction="deleteProject"
          buttonText="Delete project"
          color="red"
        />
      </div>
    </header>

    <div class="tasks">
      <h3>Tasks</h3>

      <br />

      <label class="task-area" v-for="(task, i) in tasks" :key="i">
        <input
          type="checkbox"
          :id="`task-${i}`"
          @change="handleChecked($event.target.checked, task._id, i)"
          :checked="task.done"
        />

        <div class="description-area">
          <span :class="getTaskClass(task.done, task.dueDate)">
            {{ task.description }}
          </span>
          <span class="add-info">@{{ task.owner }}</span>
          <span class="add-info">{{ formatDate(task.dueDate) }}</span>
        </div>

        <span class="check"></span>
      </label>

      <div v-if="newTaskFieldEnabled" style="max-width: 700px">
        <Input
          ref="new-task-input"
          placeholder="Type new task, @owner, M/d"
          v-model="newTaskString"
          :enterEvent="handleNewTask"
          :errorMode="error"
        />
      </div>

      <Button
        :clickFunction="handleInput"
        :buttonText="newTaskFieldEnabled ? 'Cancel' : 'Add task'"
        color="#f1f1f1"
        :iconText="newTaskFieldEnabled ? 'fas fa-times' : 'fas fa-plus'"
      />
    </div>
  </div>
</template>

<script>
import { formatRelative, isBefore } from 'date-fns';
import { mapActions } from 'vuex';
import swal from 'sweetalert';
import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default {
  components: { Input, Button },

  data: () => ({
    projectName: null,
    projectId: null,
    tasks: [],
    newTaskString: null,
    newTaskValues: {
      description: null,
      owner: null,
      dueDate: null,
    },
    newTaskFieldEnabled: false,
    summary: {
      completed: 0,
      late: 0,
      total: 0,
    },
    error: false,
  }),

  created() {
    this.getProjectTasks();
  },

  methods: {
    ...mapActions('projects', ['getProjects']),

    async getProjectTasks() {
      this.projectId = this.$route.params.projectId;

      const [responseProject, responseTasks] = await Promise.all([
        api.get(`/project/${this.projectId}`),
        api.get(`/tasks/${this.projectId}`),
      ]);

      this.projectName = responseProject.data.name || null;
      this.tasks = responseTasks.data.tasks;
      this.summary = responseTasks.data.summary;
    },

    async handleNewTask() {
      if (!this.validateNewTaskFields()) {
        this.error = true;
        return;
      }

      await api.post(`task/${this.projectId}`, {
        ...this.newTaskValues,
      });

      await this.getProjectTasks();

      this.newTaskString = null;
      this.newTaskFieldEnabled = false;
      this.newTaskValues = {
        description: null,
        owner: null,
        dueDate: null,
      };
    },

    async handleChecked(checked, taskId, taskIndex) {
      await api.patch(`/task/${taskId}`, { done: checked });
      this.tasks[taskIndex].done = checked;

      if (checked) {
        this.summary.completed += 1;

        if (isBefore(new Date(this.tasks[taskIndex].dueDate), new Date())) {
          this.summary.late -= 1;
        }
      } else {
        this.summary.completed -= 1;

        if (isBefore(new Date(this.tasks[taskIndex].dueDate), new Date())) {
          this.summary.late += 1;
        }
      }
    },

    async deleteProject() {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to delete this project?',
        buttons: ['Cancel', 'Yes'],
        icon: 'warning',
        dangerMode: true,
      }).then(async willDelete => {
        if (willDelete) {
          await api.delete(`/project/${this.projectId}`);
          this.$router.push('/');
          window.location.reload();
        }
      });
    },

    validateNewTaskFields() {
      if (!this.newTaskValues.description) {
        return false;
      }

      if (!this.newTaskValues.owner) {
        return false;
      }

      if (!this.newTaskValues.dueDate) {
        return false;
      }

      return true;
    },

    getDueDate(date = '') {
      const [month, day] = date.split('/');

      if (!month || !day) {
        return null;
      }

      if (
        Number.isNaN(Number(month)) ||
        Number.isNaN(Number(day)) ||
        Number(month) > 12 ||
        Number(day) > 31
      ) {
        this.error = true;
        return null;
      }

      const dueDate = new Date();
      dueDate.setDate(day);
      dueDate.setMonth(Number(month) - 1);

      this.error = false;

      return dueDate;
    },

    formatDate(date = Date) {
      return formatRelative(new Date(date), new Date()).split(' ')[0];
    },

    getTaskClass(done, dueDate) {
      if (done) {
        return 'task-done';
      }

      if (isBefore(new Date(dueDate), new Date())) {
        return 'task-delayed';
      }

      return '';
    },

    handleInput() {
      this.newTaskFieldEnabled = !this.newTaskFieldEnabled;
      this.error = false;
    },
  },

  watch: {
    newTaskString: function watchnewTaskString(value) {
      if (!value) {
        return;
      }

      const withoutSpaces = value.split(' ').join('');
      const [, addInfo] = withoutSpaces.split(',@');

      if (addInfo) {
        const [owner, dueDate] = addInfo.split(',');
        this.newTaskValues.owner = owner;
        this.newTaskValues.dueDate = this.getDueDate(dueDate);

        const [description] = value.split(`, @${owner}`);

        this.newTaskValues.description = description;
      }

      if (this.validateNewTaskFields()) {
        this.error = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

header {
  width: 100%;
  background-color: #161b22;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  button {
    margin-left: 32px;
  }
}

.tasks {
  margin-top: 16px;
  width: 100%;
  max-height: 100%;
  background-color: #161b22;
  padding: 16px;
  border-radius: 8px;
  color: #f1f1f1;

  overflow: auto;

  p {
    color: #696969;
  }

  .task-area {
    display: block;
    position: relative;
    margin-bottom: 12px;
    cursor: pointer;
    padding-left: 32px;
    max-width: 100%;

    .description-area {
      display: flex;
      flex-direction: row;
    }

    .add-info {
      margin-left: 16px;
      color: #696969;
    }

    input[type='checkbox'] {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }

    .check {
      left: 0;
      top: 0;
      width: 20px;
      height: 20px;
      border-radius: 5px;
      background-color: #0d1117;
      position: absolute;
    }

    input[type='checkbox']:checked ~ .check {
      background-color: #2196f3;
    }

    .check::after {
      top: 3px;
      left: 7px;
      width: 4px;
      height: 9px;
      border: solid #fff;
      border-width: 0 2px 2px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }

    .check::after {
      content: '';
      position: absolute;
      display: none;
    }

    input[type='checkbox']:checked ~ .check:after {
      display: block;
    }

    .task-done {
      color: #696969;
      text-decoration: line-through;
    }

    .task-delayed {
      color: red;
    }
  }

  button {
    margin-top: 16px;
  }
}
</style>
