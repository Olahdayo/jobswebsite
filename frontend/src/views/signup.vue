<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Choose Account Type
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Select the type of account you want to create
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="space-y-6">
          <!-- Job Seeker Option -->
          <div
            @click="$router.push('/signup/jobseeker')"
            class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-user-tie text-2xl text-primary"></i>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Job Seeker</h3>
                <p class="text-sm text-gray-500">
                  Create an account to find and apply for jobs
                </p>
              </div>
            </div>
          </div>

          <!-- Employer Option -->
          <div
            @click="$router.push('/signup/employer')"
            class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-building text-2xl text-primary"></i>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Employer</h3>
                <p class="text-sm text-gray-500">
                  Create an account to post jobs and find talent
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <div class="relative">
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  Already have an account?
                  <router-link
                    to="/login"
                    class="font-medium text-primary hover:text-primary-dark"
                  >
                    Sign in
                  </router-link>
                </span>
              </div>
            </div>
          </div>
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
