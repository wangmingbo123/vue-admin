import  axios from 'axios'


// 1 state
const state = {
    count: 10,
    users: []
}
const getters = {
    vusers: state => {
        console.log('getters is ' + JSON.stringify(state))
        return state.users
    }

}

// 3 actions
const actions = {
    getUsersByVuex({commit, state}){
        axios.get('/api/getUsers')
            .then((res) => {
                var users = [];
                users = res.data.users;
                console.log('get from axios ' + JSON.stringify(users))

                commit('set', users)

            }).catch((error) => {
            console.log(error)
        })

    }
}


// 4 mutations
const mutations = {
    set(state, users){
        console.log('set before state ' + JSON.stringify(state))
        state.users = users
        console.log('set after state ' + JSON.stringify(state))
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
