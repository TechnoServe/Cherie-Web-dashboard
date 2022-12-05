<script setup>
</script>

<template>
  <main class="contsdainer-fluid">
    <div class="row">
      <div class="col-6">
        <img src="login_img.png" alt="">
      </div>
      <div class="col-6 bg-light">
        <div class="bg-white p-5 login-box">
          <h2 class="">Create account</h2>
          <hr>

          <form>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Full name</label>
              <input type="text" class="form-control" placeholder="John Rambo">
            </div>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Email address</label>
              <input type="email" class="form-control" placeholder="hello@hey.com">
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" placeholder="******">
            </div>
            <div class="mb-3">
              <label class="form-label">Confirm password</label>
              <input type="password" class="form-control" placeholder="******">
            </div>
            <div class="d-grid gap-2">
              <router-link to="/dashboard"  class="btn btn-primary">
              Register
              </router-link>
            </div>
            <div class="d-flex mt-3">
              <p>Already have an account?</p>
              <router-link to="/" class="ms-2 text-decoration-none" >
               Login
              </router-link>
             
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
  .login-box{
    max-width: 500px;
    margin: 0 auto;
    margin-top: 20% !important;
  }
</style>