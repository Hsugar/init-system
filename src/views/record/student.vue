<template>
  <div>
    <Position>
      <!-- <span>学生档案</span> -->
    </Position>
    <h2>学生档案</h2>
    
  </div>
</template>

<script>
import Position from "@/components/Position.vue";
import Search from "@/components/Search.vue";

export default {
  name: "Student",
  data() {
    return {
      
    };
  },
  methods: {
    onDel(id) {
      console.log(id);
    }
  },
  computed: {},
  created() {
    //console.log(this.$store.state)
  },
  mounted() {},
  components: {
    Position,Search
  }
};
</script>

<style>
</style>
