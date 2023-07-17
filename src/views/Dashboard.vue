<template>
  <main class="contsdainer-fluid">
    <div class="row mt-5 mx-3">
      <div class="col-md-12 mb-3">
        <div class="d-flex mb-3">

        
          <h3>Aggregate ripeness stats</h3>
          <router-link to="" @click="triggerPrint" class="ms-4 mt-1 nav-link btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
              <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
              <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
            </svg>
            Export
          </router-link>
        </div>
        <div class="row">
          <div class="col-sm-3">
            <router-link class="text-reset text-decoration-none" :to="{name: 'ripeness_stats', params: {ripeness: 'ripe'}}">
              <div class="alert alert-ripe text-center" role="alert">
                <p class="fw-bolder text-black fs-4">{{Math.round(ripenessStats.ripe/total_artifacts)}}%</p>
                <p class="text-black">Ripe</p>
              </div>
            </router-link>
          </div>
          <div class="col-sm-3">
            <router-link class="text-reset text-decoration-none" :to="{name: 'ripeness_stats', params: {ripeness: 'underripe'}}">
              <div class="alert alert-under text-center" role="alert">
                <p class="fw-bolder text-black fs-4">{{Math.round(ripenessStats.underripe/total_artifacts)}}%</p>
                <p class="text-black">Under ripe</p>
              </div>
            </router-link>
          </div>
          <div class="col-sm-3">
            <router-link class="text-reset text-decoration-none" :to="{name: 'ripeness_stats', params: {ripeness: 'overripe'}}">
              <div class="alert alert-over text-center" role="alert">
                <p class="fw-bolder text-black fs-4">{{Math.round(ripenessStats.overripe/total_artifacts)}}%</p>
                <p class="text-black">Over Ripe</p>
              </div>
            </router-link>
          </div>

          <div class="col-sm-3">
            <div class="alert alert-warning text-center" role="alert">
              <router-link :to="{name: 'artifacts'}" class="text-reset text-decoration-none">
                <p class="fw-bolder text-black fs-4">{{total_artifacts}}</p>
                <p class="text-black">Total Uploads</p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 sidebar-sum">
        <div class="card country-summary-card mb-3 shadow border-0" v-for="(country, key) in countryStats" :key="key">
          <div class="card-body">
            <h4 class="mb-4">{{key}} ({{country.artifacts}})</h4>
            <div class="table-responsive">
              <table>
                <tr class="border-bottom">
                  <th>Ripe</th>
                  <th>Underripe</th>
                  <th>Overripe</th>
                </tr>
                <tr>
                  <td>{{Math.round(country.ripe/country.artifacts)}}%</td>
                  <td>{{Math.round(country.underripe/country.artifacts)}}%</td>
                  <td>{{Math.round(country.overripe/country.artifacts)}}%</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <div class="row">
          <div class="col-6">
            <select class="form-select" v-model="filterCounty" @change="getCountryBounds(filterCounty)">
              <option :value="null" selected>All Countries</option>
              <option :value="key" v-for="(_, key) in countryStats" :key="key" >{{key}}</option>
            </select>
          </div>
          <div class="col-4 offset-2">
            <select class="form-select" v-model="filterYear">
              <option :value="null" selected>Lifetime</option>
              <option :value="year" v-for="(year, key) in Object.keys(yearStats)" :key="key" >{{year}}</option>
            </select>
          </div>
        </div>
        <div class="mt-4" v-if="chartData">
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

        <!-- Map -->
        <div class="container">
          <h5>Map Representation</h5>
          <div id="mapid" class="container" style="height:450px"></div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import { Line, } from 'vue-chartjs'
  import moment from 'moment'
  import leaflet from 'leaflet'
  import 'leaflet.markercluster';
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
  import Chart from 'chart.js/auto'
  import LayoutDefault from './layouts/LayoutDefault.vue'
  import {db} from "../js/firebase"
  import boundaries from "../js/countries";
  import { collectionGroup, getDocs } from "firebase/firestore";  
  export default{
  components: { Line },
  data(){
    return {
      firebaseData: null,
      mapid:null,
      layer:null,
      markers:null,
      rawData: null,
      chartData:  null,
      chartOptions: {
        responsive: true,
        lineTension: 0.4,
        radius: 6,
        pointDotRadius: 1,
        elements: {
          point:{
            radius: 3
          }
        },
        interaction: {
          mode: 'point'
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
      yearStats: {},
      filterCounty: null,
      filterYear: null,
      total_artifacts: 0,
    }
  },
  watch: {
    filterCounty(){
      this.structureData()
    },
    filterYear(){
      this.structureData()
    },
  },
  mounted(){
    this.getData()
  },
  methods:{
    async getData() {
      const querySnapshot = await getDocs(collectionGroup(db, "predictions"));
      this.markers = []
      console.log(querySnapshot)

      let firebaseData = []
      querySnapshot.forEach((doc) => {
        let data = doc.data()
        firebaseData.push(data)
        if(data.coordinates){
          var coordinates_ = data.coordinates.split(',').map(str => parseFloat(str));
          this.markers.push(coordinates_)
        }
      })

      // Sort data
      firebaseData = firebaseData.sort((prevArtifact, currentArtifact) =>  prevArtifact.predictedAt-currentArtifact.predictedAt)

      this.rawData = firebaseData
      console.log(JSON.stringify(firebaseData))
      this.structureData()


      //Add map
      this.mapid = leaflet.map('mapid')
      this.mapid.fitWorld().setZoom(2);
      

      leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.mapid);
      // leaflet.geoJSON(boundaries).addTo(this.mapid);

      var pins = leaflet.markerClusterGroup();
      for(var i=0;i<this.markers.length;i++){
      var pin = leaflet.marker(this.markers[i])
        pins.addLayer(pin)
      }
      this.mapid.addLayer(pins)
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

        let year = this.formatYear(data.predictedAt)

        if(!this.yearStats[year]){
          this.yearStats[year] = 0;
        }

        // Period
        console.log(this.filterYear, year)
        if( ( (this.filterCounty && data.region == this.filterCounty) || (!this.filterCounty && this.filterYear )) && ( (this.filterYear && this.filterYear == year ) || (!this.filterYear && this.filterCounty) )){
          let month = this.formatMonthYear(data.predictedAt)
          console.log('matched')
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
        }else if(!this.filterCounty && !this.filterYear){
          let month = this.formatMonthYear(data.predictedAt)
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
      console.log("test", this.periodStats)
      this.changeChartData()
    },
    triggerPrint(){
      window.print()
    },
    changeChartData(){
      let chartData = {
        labels: Object.keys(this.periodStats),
        datasets: [
          {
            label: 'Ripe',
            backgroundColor: '#75EFA6',
            pointColor: "#75EFA6",
            borderColor: "#75EFA6",
            data: Object.values(this.periodStats).map(pred => pred.ripe)
          },
          {
            label: 'Under ripe',
            backgroundColor: '#FB896B',
            borderColor: "#FB896B",
            data: Object.values(this.periodStats).map(pred => pred.underripe).reverse()
          },
          {
            label: 'Over ripe',
            backgroundColor: '#6956E5',
            borderColor: "#6956E5",
            data: Object.values(this.periodStats).map(pred => pred.overripe).reverse()
          }
        ]
      }
      this.chartData = chartData
    },
    formatMonthYear(strDate){
      return moment(new Date(strDate)).format('MMM YYYY')
    },
    formatYear(strDate){
      return moment(new Date(strDate)).format('YYYY')
    },
    getCountryBounds(country_) {
      if(this.layer){
      this.mapid.removeLayer(this.layer)
     }
    if(country_ === "Ethiopia" || country_ === "Honduras" || country_ === "Guatemala"){
      try {
      const countryFeature = boundaries.features.find(feature => feature.properties.ADMIN === country_);

      if (countryFeature) {
        const countryBounds = leaflet.geoJSON(countryFeature.geometry).getBounds();
        var lastLayer = leaflet.geoJSON(countryFeature).addTo(this.mapid);
        this.zoomToCountry(countryBounds);
        this.layer = lastLayer
      }
    } catch (error) {
      console.error(error);
    }
    
    }
    else{
      this.mapid.fitWorld().setZoom(2)
    }
    
  },
  zoomToCountry(bounds) {
    this.mapid.fitBounds(bounds);
  }
  }
  }
</script>

<style lang="scss" scoped>
  h5{
    margin:30px 0 30px 0;
  }
  .prof-items img{
    max-width: 50px;
  }
  .alert-ripe{
    background: #75EFA6;
  }

  .alert-under{
    background: #FB896B;
  }
  .alert-total{
    background: #75EFA6;
  }
  .alert-over{
    background: #6956E5;
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