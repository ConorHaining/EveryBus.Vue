<template>

  <div>
    <div class="bus">
      <span v-bind:style="{color: textColour}"><slot></slot></span>
      <div class="arrow_box" v-bind:style="styleObject"></div>
    </div>
  </div>

</template>

<style>
  .bus {
    color: whitesmoke;
    text-align: center;
    display: inline-block;
    height: 18px;
    width: 32px;
  }
  .bus span{
    position: relative;
    bottom: 5px;
    right: 7px;
  }
  .arrow_box {
    bottom: 24px;
    position: relative;
    border-radius: 100%;
    width: 18px;
    height: 18px;
    z-index: -1;
  }
  .arrow_box:after {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: inherit;
    border-width: 6px;
    margin-left: -6px;
  }
</style>

<script>
  
export default {
  name: 'BusIcon',
  data() {
    return {
      styleObject: {
        background: this.colour,
        border: `0 solid ${this.colour}`,
        transform: `rotate(${this.heading}deg)`
      }  
    }
  },
  props: {
    textColour: {
      type: String,
      default: 'whitesmoke'
    },
    colour: {
      type: String,
      default: 'red'
    },
    heading: {
      type: Number,
      default: 0
    },
  }
};
</script>
