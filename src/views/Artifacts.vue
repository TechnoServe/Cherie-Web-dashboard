
<template>
  <main class="contsdainer-fluid">
    <div class="row mt-5 mx-3">
      <div class="col-8">
        <h3 class="mb-3">Coffee cherry artifacts</h3>
        <!-- <p>{{artifacts}}</p> -->
      </div>
      <div class="col-4">
        <!-- <a href="https://console.firebase.google.com/u/1/project/cherie-323217/firestore/data/" class="btn btn-primary" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-plus" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
            <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
          </svg>
          Add Images
        </a> -->
      </div>
      <div class="col-12">
        <p>Total: <b>{{total_artifacts}}</b></p>
      </div>
      <form action="">
        <div class="row">

       
          <div class="col-2">
            <h4 class="mb-3">Country</h4>
            <label class="form-label">Filter a specific country</label>
            <select class="form-select" v-model="filterCounty" name="country" >
              <option selected value="">Select Country</option>
              <option v-for="(country, key) in countryList" :key="key">{{country}}</option>
            </select>
          </div>
          <div class="col-3 mb-4">
            <h4 class="mb-3">Period</h4>
            <div class="row">
              <div class="col-md-6">
                <label class="form-label">From</label>
                <input name="from_date" type="date" max="100" v-model="from_date" class="form-control">
              </div>
              <div class="col-md-6">
                <label class="form-label">To</label>
                <input name="to_date" type="date" max="100" v-model="to_date" class="form-control">
              </div>
            </div>
          </div>
          <div class="col-3 mt-5">
            <button type="submit" class="btn btn-primary mt-4">Filter</button>
          </div>

        </div>
      </form>
      <div class="col-12">
        <table id="table" class="table bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Region</th>
              <th>Ripe</th>
              <th>Underripe</th>
              <th>Overrripe</th>
              <th>Rating</th>
              <th>Predicted At</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cherry, key) in artifacts" :key="key">
              <td>{{key+1}}</td>
              <td>{{cherry.region}}</td>
              <td>{{Math.round(cherry.ripe)}}</td>
              <td>{{Math.round(cherry.underripe)}}</td>
              <td>{{Math.round(cherry.overripe)}}</td>
              <td>
                <template v-if="cherry.rating">
                  {{cherry.rating * 20 + '%'}}
                </template>
                <template v-else>
                  -
                </template>
              </td>
              <td>{{formatDate(cherry.predictedAt)}}</td>
              <td>
                <a class="btn btn-primary" :href="cherry.imageUri" target="_blank">View</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </main>
</template>

<script>
import DataTable from "@andresouzaabreu/vue-data-table";
import "bootstrap/dist/css/bootstrap.min.css";
import "@andresouzaabreu/vue-data-table/dist/DataTable.css";
import moment from 'moment'
import leaflet from 'leaflet'
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { db } from "../js/firebase"
import { collectionGroup, query, orderBy, getDocs } from "firebase/firestore"; 
  export default{
    data(){
      return {
        artifacts: null,
        
        total_artifacts: 0,
        rawData: null,
        underripe_min: null,
        underripe_max: null,
        ripe_min: null,
        ripe_max: null,
        from_date: null,
        to_date: null,
        overripe_min: null,
        overripe_max: null,
        countryStats: [],
        countryList: [],
        filterCounty: null,
        initialRun: false,
      }
    },
    components: {DataTable},
    
    async mounted(){
      console.log(this.$route.query)
     
      this.filterCounty = this.$route.query?.country
      this.from_date = this.$route.query?.from_date
      this.to_date = this.$route.query?.to_date

      console.log(this.from_date)
      await this.getArtifacts()
    },
    watch:{
      filterCounty(newCountry, oldCountry){
        // console.log({oldCountry, newCountry, 
        //   thiscount: this.filterCounty
        // })
        // if(this.filterCounty != oldCountry){
        //   this.$router.push({ path: 'artifacts', query: { country: this.filterCounty }})
        //   // location.href = location.href
        // }
        // this.structureData()
      },
      underripe_min(){
        // this.structureData()
      },
      underripe_max(){
        // this.structureData()
      },
      ripe_min(){
        this.structureData()
      },
      ripe_max(){
        this.structureData()
      },
      overripe_min(){
        this.structureData()
      },
      overripe_max(){
        this.structureData()
      },

    },
    computed:{
      parametersTable1() {
        return {
          data: this.artifacts,
          actionMode: "multiple",
          columnKeys: [
            "name",
            "email",
            "gender",
            "country",
            "job",
            "city",
            "created_at"
          ]
        };
      },
    },
    methods:{
      
      async getArtifacts() {
        const querySnapshot = await getDocs(collectionGroup(db, "predictions"));
        this.rawData = querySnapshot
        this.structureData()
        this.initialRun = true
      },

      structureData(){
        this.total_artifacts = 0
        let country = {};
        let artifactsData = []
        this.rawData.forEach((doc) => {
          let data = doc.data()
          let region = data.region
          // get countries list only on initial run
          if(!this.initialRun){
            if(this.countryList.indexOf(region) < 0){
              this.countryList.push(region)
            }
          }

          if(this.filterCounty && region != this.filterCounty){
            // console.log("skip", data)
            return null;
          };

          // filter ripeness
          if(this.underripe_min && data.underripe < this.underripe_min){
            return null;
          }
          if(this.underripe_max && data.underripe > this.underripe_max){
            return null;
          }
          if(this.ripe_min && data.ripe < this.ripe_min){
            return null;
          }
          if(this.ripe_max && data.ripe > this.ripe_max){
            return null;
          }
          if(this.overripe_min && data.overripe < this.overripe_min){
            return null;
          }
          if(this.overripe_min && data.overripe > this.overripe_min){
            return null;
          }

          if(this.from_date && this.formatInternalDate(data.predictedAt) < this.formatInternalDate(this.from_date)){
            return null;
          }

          if(this.to_date && this.formatInternalDate(data.predictedAt) > this.formatInternalDate(this.to_date)){
            return null;
          }
          artifactsData.push(data)

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
          this.countryStats = country
        })
        
        this.artifacts = artifactsData, 2000
        const event = new Event('build');
        document.dispatchEvent(event);
      },

      formatDate(strDate){
        return moment(new Date(strDate)).format('DD/MM/YYYY HH:mm')
      },
      formatInternalDate(strDate){
        return moment(new Date(strDate)).format('YYYY/MM/DD HH:mm')
      }
    }
  }
</script>

<style scoped>
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
</style>