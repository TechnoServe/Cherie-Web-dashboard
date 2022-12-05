<template>
  <div class="LayoutDefault">
    <main class="contsdainer-fluid">
      <div class="row d-print-none">
        <div class="col-12">
        <nav class="navbar navbar-expand-md bg-light">
          <div class="container-fluid">
            <router-link :to="{name: 'dashboard'}">
              <img class="logo" src="/favicon.png" alt="">
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <router-link :to="{name: 'dashboard'}" class="nav-link active">
                    Dashboard
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link :to="{name: 'artifacts'}" class="nav-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-images" viewBox="0 0 16 16">
                      <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                      <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"/>
                    </svg>
                    Report
                  </router-link>
                </li>
              </ul>
              <div class="d-flex prof-items">
                <router-link :to="{name: 'profile'}">
                  <img class="mt-2 profile" :src="userImg" @error="setAltImg" alt="Profile image">
                </router-link>
              </div>
            </div>
          </div>
        </nav>  
        </div>
      </div>
      <router-view></router-view>
    </main>
    <footer class="LayoutDefault__footer text-center">
      &copy; TNS 2022
    </footer>
  </div>
</template>

<script>
import { auth } from "../../js/firebase"
export default({
    data() {
      return {
        user: null,
      }
    },
    computed:{
      userImg(){
        return this.user?.photoURL??"/profile_icon.png"
      }
    },
    created() {
      auth.onAuthStateChanged(user => {
        if (user) {
          this.user = user;
          console.log(user)
        }
      });
    },
    methods:{
      
      setAltImg(event) { 
        event.target.src = "/profile_icon.png" 
      } 
    }
})
</script>

<style lang="scss" scoped>
  .logo{
    max-height: 60px;
  }

  .prof-items img{
    max-width: 50px;
    border-radius: 50%;
  }
  
  .nav-link:hover{
    color: #6956e5;
    font-weight: 700;
    transition: .5s all;
  }
  .contsdainer-fluid{
    min-height: 90vh;
  }
</style>
