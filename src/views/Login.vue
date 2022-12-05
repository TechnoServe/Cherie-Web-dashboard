
<template>
  <main class="contsdainer-fluid">
    <div class="row">
      <div class="col-6">
        <img src="login_img.png" alt="">
      </div>
      <div class="col-6 bg-light">
        <div class="bg-white p-5 login-box">
          <h2 class="text-center">Login account</h2>
          <hr>

           <section id="firebaseui-auth-container"></section>

          <!-- <form>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Email address</label>
              <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">Password</label>
              <input type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="exampleCheck1">
              <label class="form-check-label" for="exampleCheck1">Remember me</label>
            </div>
            <div class="d-grid gap-2">
              <router-link to="/dashboard"  class="btn btn-primary">
              Login
              </router-link>
            </div>
            <div class="d-flex mt-3">
              <p>Don't have account!</p>
              <router-link to="/register" class="ms-2 text-decoration-none" >
               Register here
              </router-link>
             
            </div>
          </form> -->
        </div>
      </div>
     
    </div>
  </main>
</template>
<script>
// https://firebase.google.com/docs/web/modular-upgrade#example_1_refactoring_an_function
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebaseui";
import "firebaseui/dist/firebaseui.css";
import {auth} from "../js/firebase"
// const provider = new GoogleAuthProvider();
export default{
  mounted(){
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(auth);
    }
    var uiConfig = {
      signInSuccessUrl: "/dashboard",
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  }
}
</script>
<style scoped>
  .login-box{
    max-width: 400px;
    margin: 0 auto;
    margin-top: 20% !important;
  }
</style>