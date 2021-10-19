import Vue from 'vue'
import Vuex from  'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({
    state:{
        userInfo:'111',
        token:'',
        projectId:'',
        depotId:''
    },
    mutations:{
        isLoginEd(state,msg){
            state.userInfo= msg
            localStorage.setItem('userInfo', msg)
        },
        getToken(state,msg){
            state.token= msg
            localStorage.setItem('token', msg)
        },
        getProjectId(state,msg){
            state.projectId= msg
        },
        getDepotId(state,msg){
            state.depotId= msg
        }
    }

})
export default store;