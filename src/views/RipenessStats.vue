<template>
  <main class="contsdainer-fluid">
    <div class="row mt-5 mx-3">
      <div class="col-12">
        <h2 class="display-3 mb-4 text-capitalize">{{ripeness}} Statistics</h2>
      </div>
      
      <div class="col-md-3 sidebar-sum">
        <p class="text-muted">Below are country statistics for average <b class="text-capitalize">{{ripeness}}</b> cherry</p>
        <div class="card country-summary-card mb-3 p-3 shadow border-0">
          <table class="table">
            <tr class="border-bottom">
              <th>Country</th>
              <th class="text-capitalize">{{ripeness}}</th>
            </tr>
            <tr v-for="(country, key) in countryStats" :key="key">
              <td>{{key}}</td>
              <td>{{Math.round(country[ripeness]/country.artifacts)}}%</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="col-md-9">
        <div class="col-4">
          <select class="form-select" v-model="filterYear">
            <option :value="null" selected>Select Year</option>
            <option :value="year" v-for="(year, key) in Object.keys(yearStats)" :key="key" >{{year}}</option>
          </select>
        </div>
        <div class="">
          <Line
            :chartData="chartData"
            :chart-options="chartOptions"
            :chart-data="chartData"
            chart-id="d_chart"
            dataset-id-key="label"
            :width="400"
            :height="400"
          ></Line>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import { Line, } from 'vue-chartjs'
  import moment from 'moment'
  import Chart from 'chart.js/auto'
  import { db } from "../js/firebase"
  import { collectionGroup, getDocs } from "firebase/firestore";  
  export default{
  components: { Line },
  data(){
    return {
      firebaseData: null,
      ripeness: null,
      rawData: null,
      chartData:  {
          labels: [],
          datasets: [
          ]
      },
      chartOptions: {
        responsive: true,
        lineTension: 0.4,
        radius: 6,
        elements: {
          point:{
            radius: 3
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
      countryPeriodStats: {},
      countryPeriodArtifactsCount: {},
      ripenessStats:{
        ripe: 0,
        underripe: 0,
        overripe: 0,
      },
      periodStats: {},
      yearStats: {},
      filterYear: null,
      filterCounty: null,
      total_artifacts: 0,
    }
  },
  watch: {
    filterYear(){
      this.structureData()
    }
  },
  mounted(){
    let ripeness = this.$route.params.ripeness
    if(ripeness) this.ripeness = ripeness
    else{
      this.$router.go(-1)
    }
   
    this.getData()
  },
  methods:{
    async getData() {
      const querySnapshot = await getDocs(collectionGroup(db, "predictions"))

      let firebaseData = []
      querySnapshot.forEach((doc) => {
        let data = doc.data()
        firebaseData.push(data)
      })

      // Sort data
      firebaseData = firebaseData.sort((prevArtifact, currentArtifact) =>  prevArtifact.predictedAt-currentArtifact.predictedAt)

      this.rawData = firebaseData

      this.structureData()
    },
    structureData(){
      this.total_artifacts = 0
      this.periodStats = {}
      this.ripenessStats = {
        ripe: 0,
        underripe: 0,
        overripe: 0,
      }
      let country = {};
      this.rawData.forEach((data) => {
        let region = data.region

        // Check if region exists in object
        if(!country[region]){
          country[region] = {
            artifacts: 0,
            underripe: 0,
            overripe: 0,
            ripe: 0,
          }
        }

        let year = this.formatYear(data.predictedAt)
        if(!this.yearStats[year]){
          this.yearStats[year] = 0;
        }

        if(!this.countryPeriodStats[region]){
          this.countryPeriodStats[region] = {}
        }

        if(!this.countryPeriodArtifactsCount[region]){
          this.countryPeriodArtifactsCount[region] = {}
        }

        country[region].artifacts += 1
        this.total_artifacts += 1
        country[region].underripe += data.underripe
        country[region].overripe += data.overripe
        country[region].ripe += data.ripe

        // ripeness
        this.ripenessStats.ripe += data.ripe
        this.ripenessStats.underripe += data.underripe
        this.ripenessStats.overripe += data.overripe
        this.countryStats = country

        // Period
        let month = this.formatMonthYear(data.predictedAt)
        

        if(!this.countryPeriodStats[region][month]){
          // initialize the period
          this.countryPeriodStats[region][month] = {
            ripe: 0,
            underripe: 0,
            overripe: 0,
          }
          
        }

        if(!this.countryPeriodArtifactsCount[region][month]){
          // initialize the period
          this.countryPeriodArtifactsCount[region][month] = 0
        }

        // Filter the year
        if((this.filterYear && this.filterYear == year) || !this.filterYear){
          this.countryPeriodStats[region][month].ripe+=data.ripe
          this.countryPeriodStats[region][month].underripe+=data.underripe
          this.countryPeriodStats[region][month].overripe+=data.overripe

          this.countryPeriodArtifactsCount[region][month] += 1

          if(!this.periodStats[month]){
          // initialize the period
          this.periodStats[month] = {
            ripe: 0,
            underripe: 0,
            overripe: 0,
          }
          this.periodStats[month].ripe+=data.ripe
          this.periodStats[month].underripe+=data.underripe
          this.periodStats[month].overripe+=data.overripe
        }
        }

        
      })
      this.changeChartData()
    },
    changeChartData(){
      let months = Object.keys(this.periodStats);
      let datasets = []

      Object.keys(this.countryPeriodStats).forEach((country) => {
        let cData = this.countryPeriodStats[country]

        let color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`;

        // loop through available months and get the data
        let countryData = []
        months.forEach(month => {
          let artifactsCount = this.countryPeriodArtifactsCount[country][month]??1
          let monthValue = (cData[month]?.[this.ripeness])??0
          countryData.push(monthValue/artifactsCount)
        })

        datasets.push({
          label: country,
          backgroundColor: color,
          borderColor: color,
          data: countryData
        })
      })

      let chartData = {
        labels: months,
        datasets: datasets
      }

      console.log(chartData)
      this.chartData = chartData
    },
    formatMonthYear(strDate){
      return moment(new Date(strDate)).format('MMM YYYY')
    },
    formatYear(strDate){
      return moment(new Date(strDate)).format('YYYY')
    },
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