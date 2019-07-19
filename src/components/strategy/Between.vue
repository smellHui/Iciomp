<template>
  <div>
    <Input type="text" :size="size" :style="styles" v-model="start" @on-keyup="keyUp" @on-change="keyUp" :disabled="disabled" />
    <span> &ensp;—&ensp; </span>
    <Input type="text" :size="size" :style="styles" v-model="end" @on-keyup="keyUp" @on-change="keyUp" :disabled="disabled" />
  </div>
</template>

<script>
export default {
  name: 'Between',
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default () {
        return false
      }
    },
    size: {
      type: String,
      default () {
        return 'default'
      }
    },
    styles: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      start: '',
      end: ''
    }
  },
  mounted () {
    if (this.value.length > 0) {
      this.start = this.value[0]
    }
    if (this.value.length > 1) {
      this.end = this.value[1]
    }
  },
  methods: {
    keyUp (event) {
      let p = /^\s+$/g
      let v = []
      if (!p.test(this.start) || !p.test(this.end)) {
        v.push(this.start)
        v.push(this.end)
      }
      this.$emit('input', v)
    }
  }
}
</script>
