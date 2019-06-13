import axios from 'axios'

var data={
    "roleName":"wang"
}
axios({
    method:'post',
    url:'/api/addSysRole',
    data:data
}).then((res)=>{

}).catch((error)=>{

})