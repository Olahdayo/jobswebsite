<template>
  <div
    class="container d-flex align-items-center justify-content-center min-vh-100"
  >
    <div class="col-md-6">
      <div class="card shadow">
        <div class="card-body">
          <h1 class="text-center mb-4">Create an Account</h1>
          <p class="text-center mb-4">
            Choose your account type to get started:
          </p>
          <div class="d-flex justify-content-around">
            <router-link to="/signup/jobseeker" class="btn btn-primary w-45"
              >Job Seeker</router-link
            >
            <router-link to="/signup/employer" class="btn btn-secondary w-45"
              >Employer</router-link
            >
          </div>
          <p class="mt-3 text-center">
            Already have an account?
            <router-link to="/login" class="link-primary">Login</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Signup",
};
</script>

<style scoped>
.w-45 {
  width: 45%;
}
</style>
