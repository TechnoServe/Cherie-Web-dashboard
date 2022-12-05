<template>
  <main class="contsdainer-fluid">
    <div class="row mt-5 mx-3">
      <div class="col-12">
        <template v-if="user">
          <h3>{{user.displayName}}</h3>
          <p>{{user.email}}</p>
          <button class="btn btn-danger" @click="signOut">Logout</button>
        </template>
      </div>
      <div class="col-md-3 sidebar-sum">
        <div class="card country-summary-card mb-3 shadow border-0" v-for="(country, key) in countryStats" :key="key">
          <div class="card-body">
            <h4 class="mb-4">{{key}} ({{country.artifacts}})</h4>
            <div class="table-responsive">
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import { Line, } from 'vue-chartjs'
  import moment from 'moment'
import { auth, db } from "../js/firebase"
  import Chart from 'chart.js/auto'
  import LayoutDefault from './layouts/LayoutDefault.vue'
  import { collectionGroup, getDocs } from "firebase/firestore";  
  export default{
  components: { Line },
  data(){
    return {
      firebaseData: null,
      rawData: null,
      user: null,
      chartData:  {
          labels: [],
          datasets: [
            {
              label: 'Ripe',
              backgroundColor: '#75EFA6',
              borderColor: "#75EFA6",
              data: []
            },
            {
              label: 'Under ripe',
              backgroundColor: '#FB896B',
              borderColor: "#FB896B",
              data: []
            },
            {
              label: 'Over ripe',
              backgroundColor: '#6956E5',
              borderColor: "#6956E5",
              data: []
            }
          ]
      },
      chartOptions: {
        responsive: true,
        lineTension: 0.4,
        radius: 6,
        elements: {
            point:{
                radius: 0
            }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              display: true
            },
            ticks:{
              callback: function(value, index, ticks) {
                return value + '%';
              }
            }
          }
        },
        maintainAspectRatio: false
      },
      countryStats: [],
      ripenessStats:{
        ripe: 0,
        underripe: 0,
        overripe: 0,
      },
      periodStats: {},
      filterCounty: null,
      total_artifacts: 0,
    }
  },
  created() {
    auth.onAuthStateChanged(user => {
      if (user) {
        // Check if current user has access to the project
        getDocs(collectionGroup(db, "predictions"))
        .catch(error => {
          this.signOut()
          console.log(JSON.stringify(error))
          alert(`There is an issue, ${error}\nCheck if you have access or request access to the admin`)
        })
        this.user = user;
      }
    });
  },
  watch: {
  },
  mounted(){
  },
  methods:{
    signOut(e) {
      e?.stopPropagation();
      auth.signOut();
      this.$router.push({
        name: "login"
      });
    },
    formatMonthYear(strDate){
      return moment(new Date(strDate)).format('MMM YYYY')
    }
  }
  }
</script>

<style lang="scss" scoped>
  .prof-items img{
    max-width: 50px;
  }
  .alert-under{
    background: #B5A9FB;
  }

  .alert-under{
    background: #B5A9FB;
  }
  .alert-total{
    background: #75EFA6;
  }
  .alert-over{
    background: #FBC7A4;
  }
  .sidebar-sum{
    .country-summary-card{
      &:hover{
          box-shadow: 0 2px 5px #6956e5a3 !important;
          transition: 200ms all;
      }
      th{
        width: 25%;
      }
    }
  }
  
</style>