<template>
  <div id="template-container">
    <aside>
      <h2>Projects</h2>

      <ul>
        <li v-for="(project, i) in projects" :key="i">
          <router-link :to="`/tasks/${project._id}`">
            {{ project.name }}
          </router-link>
        </li>
      </ul>

      <Button
        :clickFunction="handleNewProject"
        buttonText="New project"
        color="#f1f1f1"
        iconText="fas fa-plus"
      />
    </aside>

    <div id="template-content">
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Button from '../components/Button';

export default {
  components: { Button },

  computed: {
    ...mapState('projects', ['projects']),
  },

  async created() {
    await this.getProjects();

    if (this.$route.path !== '/') {
      return;
    }

    if (this.projects[0]) {
      // eslint-disable-next-line
      this.$router.push(`/tasks/${this.projects[0]._id}`).catch(err => {});
    } else {
      // eslint-disable-next-line
      this.$router.push('/new-project').catch(err => {});
    }
  },

  methods: {
    ...mapActions('projects', ['getProjects']),

    handleNewProject() {
      if (this.$route.name !== 'NewProject') {
        this.$router.push({ name: 'NewProject' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#template-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;

  #template-content {
    padding: 16px;
    height: 100%;
    width: 100%;
  }

  aside {
    height: 100%;
    width: 200px;
    background-color: #161b22;
    padding: 16px;

    ul {
      margin-top: 16px;
      max-height: 500px;
      overflow: auto;

      li {
        margin-top: 8px;
        list-style: none;
        border-bottom: 1px solid #2c2c2c;
        display: flex;

        a {
          text-decoration: none;
          padding: 8px 0;
          color: #f1f1f1;
          width: 100%;
        }
      }
    }

    button {
      margin-top: 16px;
    }
  }
}
</style>
