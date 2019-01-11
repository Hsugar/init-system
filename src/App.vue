<template>
    <div id="app" >
        <Header @toggle="toggle"></Header>
        <div class="page-main">
            <Nav></Nav>
            <div class="page-content">
                <router-view  v-if="$router.currentRoute.meta && $router.currentRoute.meta.refresh"></router-view>
                <transition name="fadein">
                    <!-- 暂时关闭缓存<keep-alive> -->
                        <router-view  v-if="!$router.currentRoute.meta || !$router.currentRoute.meta.refresh"></router-view>
                    <!-- </keep-alive> -->
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import Nav from '@/components/Nav.vue';
import Header from '@/components/Header.vue';

export default {
    name: 'App',
    data(){
        return {
            isCollapse: false
        }
    },
    methods: {
        toggle(isCollapse){
            this.isCollapse = isCollapse;
        }
    },
    computed:{
        
    },
    created(){
        //console.log(this.$store.state)
    },
    mounted(){
        setTimeout(function(){
            //console.log(this.$store.state)
        }.bind(this), 3000);
    },
    components:{
        Nav,
        Header
    }
}
</script>

<style>
#app{
    height: 100%;
    /* overflow: hidden; */
}
.page-main{
    display: flex;
    overflow-x: hidden;
    overflow-y: auto;
}
.page-content{
    box-sizing: border-box;
    flex: 1;
    /* padding: 0 26px; */
    background: #fff;
}
.fadein-enter-active, .fadein-leave-active {
    transition: all .3s ease-in;
    opacity: 1
}
.fadein-enter, .fadein-leave-to /* .fadein-leave-active below version 2.1.8 */ {
    opacity: .7
}

.panel-box{
    clear: both;
}
.panel-bodyer{
    background-color: #fff;
    border-top: 4px solid #C2CBD8;
    margin-bottom: 15px;
    position: relative;
}
</style>
