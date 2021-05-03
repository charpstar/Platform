<template>
    <div>
        
    </div>
</template>

<script>
import backend from '../backend'
export default {
    mounted() {
        backend.getUsers().then((users)=>{
            Object.values(users).forEach(user => {
                if(user.usertype == "Modeller"){
                  // eslint-disable-next-line no-console
                    console.log(user)   
                }
            })
        })
    }
}
</script>

<style>

</style>