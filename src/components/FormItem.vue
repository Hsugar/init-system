<template>
    <div class="form-item">
        <label
            :style="{'width':width}"
            class="form-label" 
            :for="forElement">{{text}}：</label>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'FormItem',
    props: {
        text: {
            type: String,
            default: ''
        },
        forElement: {
            type: String,
            default:''
        },
        width:{
            type: String,
            default: ()=>{
                return '98px'
            }
        }
    },
    methods:{
        
    },
    data () {
        return {
            isDisabled: false
        }
    }
}
</script>

<style scoped lang="scss">
.form-item{
    margin-bottom: 20px;
    position: relative;
    display: flex;
    div{
        width: 80%
    }
}
.form-item:after{
    content: '';
    display: block;
    clear: both;
    font-size: 0;
    overflow: hidden;
    height: 0;
}
.form-label{
    float: left;
    font-size: 15px;
    color: #606266;
    text-align: right;
    line-height: 32px;
}

</style>
