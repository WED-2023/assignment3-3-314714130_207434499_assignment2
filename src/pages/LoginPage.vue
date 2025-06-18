<template>
  <div class="login-page">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label>Username:</label>
        <input v-model="state.username" type="text" class="form-control" />
        <div v-if="v$.username.$error" class="text-danger">
          Username is required.
        </div>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input v-model="state.password" type="password" class="form-control" />
        <div v-if="v$.password.$error" class="text-danger">
          Password is required (at least 6 characters).
        </div>
      </div>
      <button type="submit" class="btn btn-primary mt-3">Login</button>
    </form>
  </div>
</template>

<script>
import { reactive, getCurrentInstance } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: "LoginPage",
  setup(_, { expose }) {
    const state = reactive({
      username: '',
      password: '',
    });

    const rules = {
      username: { required },
      password: { required, minLength: minLength(6) },
    };

    const v$ = useVuelidate(rules, state);
    const { appContext } = getCurrentInstance();
    const globalProperties = appContext.config.globalProperties;
    const router = useRouter();

    const login = async () => {
      if (await v$.value.$validate()) {
        try {
          await axios.post('http://localhost:3000/Login', {
            username: state.username,
            password: state.password
          }, { withCredentials: true });
          globalProperties.store.dispatch('login', state.username);
          router.push({ name: 'main' });
        } catch (err) {
          globalProperties.toast(
            "Login failed",
            err.response?.data?.message || err.message,
            "danger"
          );
        }
      }
    };

    expose({ login });

    return { state, v$, login };
  }
};
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: auto;
}
</style>
