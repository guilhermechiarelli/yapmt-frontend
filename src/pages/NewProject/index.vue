<template>
  <div>
    <header>
      <Input
        placeholder="Type the project name"
        :enterEvent="handleNewProject"
        :errorMode="error"
        v-model="projectName"
      />
    </header>

    <div class="container">
      <h3>Project tasks</h3>
      <br />
      <p>Type the project name and hit enter to start creating tasks...</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import api from '../../services/api';
import Input from '../../components/Input';

export default {
  components: { Input },

  data: () => ({
    projectName: null,
    error: false,
  }),

  methods: {
    ...mapActions('projects', ['getProjects']),

    async handleNewProject() {
      if (!this.projectName) {
        this.error = true;
        return;
      }

      const response = await api.post('/project', { name: this.projectName });

      await this.getProjects();

      this.$router.push(`/tasks/${response.data._id}`);
    },
  },

  watch: {
    projectName: function watchProjectName(value) {
      if (value) this.error = false;
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  background-color: #161b22;
  padding: 16px;
  border-radius: 8px;

  .input-container {
    width: 300px;
    padding: 8px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #2c2c2c;

    input {
      border: 1px solid green;
      background-color: transparent;
      border: none;
      width: 100%;
      color: #f1f1f1;
    }

    i {
      color: red;
    }
  }

  .error {
    border-bottom: 1px solid red;
  }
}

.container {
  margin-top: 16px;
  width: 100%;
  background-color: #161b22;
  padding: 16px;
  border-radius: 8px;
  color: #f1f1f1;

  p {
    color: #696969;
  }
}
</style>
