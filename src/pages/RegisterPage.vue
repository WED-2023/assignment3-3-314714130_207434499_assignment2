<template>
  <div class="register-page">
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label>Username:</label>
        <input v-model="state.username" type="text" class="form-control" />
        <div v-if="v$.username.$error" class="text-danger">
          <span v-if="v$.username.required.$invalid">Username is required.</span>
          <span v-else-if="v$.username.alphaNum.$invalid || v$.username.minLength.$invalid || v$.username.maxLength.$invalid">Username must be 3-8 letters only.</span>
        </div>
      </div>
      <div class="form-group">
        <label>First Name:</label>
        <input v-model="state.firstname" type="text" class="form-control" />
        <div v-if="v$.firstname.$error" class="text-danger">
          First name is required.
        </div>
      </div>
      <div class="form-group">
        <label>Last Name:</label>
        <input v-model="state.lastname" type="text" class="form-control" />
        <div v-if="v$.lastname.$error" class="text-danger">
          Last name is required.
        </div>
      </div>
      <div class="form-group">
        <label>Country:</label>
        <input v-model="state.country" type="text" class="form-control" />
        <div v-if="v$.country.$error" class="text-danger">
          Country is required.
        </div>
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input v-model="state.email" type="email" class="form-control" />
        <div v-if="v$.email.$error" class="text-danger">
          <span v-if="v$.email.required.$invalid">Email is required.</span>
          <span v-else-if="v$.email.email.$invalid">Must be a valid email.</span>
        </div>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input v-model="state.password" type="password" class="form-control" />
        <div v-if="v$.password.$error" class="text-danger">
          <span v-if="v$.password.required.$invalid">Password is required.</span>
          <span v-else-if="v$.password.minLength.$invalid || v$.password.maxLength.$invalid || v$.password.passwordComplexity.$invalid">Password must be 5-10 chars, include a number and a special char.</span>
        </div>
      </div>
      <div class="form-group">
        <label>Confirm Password:</label>
        <input v-model="state.confirmPassword" type="password" class="form-control" />
        <div v-if="v$.confirmPassword && v$.confirmPassword.$error" class="text-danger">
          Passwords must match.
        </div>
      </div>
      <div class="form-group">
        <label>Profile Picture URL (optional):</label>
        <input v-model="state.profilePic" type="text" class="form-control" />
      </div>
      <button type="submit" class="btn btn-success mt-3">Register</button>
    </form>
  </div>
</template>

<script>
import { reactive, getCurrentInstance } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, email as emailValidator, alphaNum, helpers } from '@vuelidate/validators';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: "RegisterPage",
  setup(_, { expose }) {
    const { appContext } = getCurrentInstance(); // Get the current instance context
    const globalProperties = appContext.config.globalProperties;
    const router = useRouter(); // Get router instance

    const state = reactive({
      username: '',
      firstname: '',
      lastname: '',
      country: '',
      email: '',
      password: '',
      confirmPassword: '',
      profilePic: ''
    });

    // Custom validator for password complexity (server-side rules)
    const passwordComplexity = helpers.regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{5,10}$/);
    // Custom validator for username (server-side rules)
    const usernameFormat = helpers.regex(/^[A-Za-z]{3,8}$/);

    // Custom validator for password confirmation
    const passwordsMatch = (value) => value === state.password;

    const rules = {
      username: { required, alphaNum: helpers.withMessage('Username must be 3-8 letters only', alphaNum), minLength: minLength(3), maxLength: maxLength(8), usernameFormat: helpers.withMessage('Username must be 3-8 letters only', usernameFormat) },
      firstname: { required },
      lastname: { required },
      country: { required },
      email: { required, email: emailValidator },
      password: { required, minLength: minLength(5), maxLength: maxLength(10), passwordComplexity: helpers.withMessage('Password must be 5-10 chars, include a number and a special char', passwordComplexity) },
      confirmPassword: { required, passwordsMatch: helpers.withMessage('Passwords must match', passwordsMatch) } // Using custom validator
    };

    const v$ = useVuelidate(rules, state);

    const register = async () => {
      console.log('Validating form...');
      console.log('Password in state (before validate):', state.password);
      console.log('Confirm Password in state (before validate):', state.confirmPassword);

      if (await v$.value.$validate()) {
        console.log('Validation successful!');
        try {
          await axios.post('http://localhost:3000/Register', {
            username: state.username,
            firstname: state.firstname,
            lastname: state.lastname,
            country: state.country,
            password: state.password,
            confirmPassword: state.confirmPassword,
            email: state.email,
            profilePic: state.profilePic || ""
          });
          globalProperties.toast("Registration Successful", "You can now login", "success");
          router.push('/login');
        } catch (err) {
          console.error("Registration error:", err);
          globalProperties.toast("Registration failed", err.response?.data?.message || err.message, "danger");
        }
      } else {
        console.log('Validation failed. Errors:', v$.value.$errors);
        if (v$.confirmPassword) {
          console.log('Confirm Password specific errors:', v$.confirmPassword.$errors);
        } else {
          console.log('v$.confirmPassword is undefined. This should not happen if rule name is correct.');
        }
      }
    };

    expose({ register });

    return { state, v$, register };
  }
};
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: auto;
}
</style>
