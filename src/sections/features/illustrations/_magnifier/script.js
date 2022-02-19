function suffix(val, suf) {
  if (typeof val === 'string' && val.match(/[^0-9.]/)) return val; // If it's not just numbers, assume it already has a suffix
  return `${val}${suf}`; // Otherwise add the given suffix
}
function px(val) { return suffix(val, 'px'); } // Give values a default unit of 'px'
function deg(val) { return suffix(val, 'deg'); } // Give values a default unit of 'deg'
function secs(val) { return suffix(val, 's'); } // Give values a default unit of 's'

export default {
  props: { initialVisibleState: Boolean },

  data: () => ({
    transitionTime: 0.5,
    transitionEasing: 'ease',

    opacity: 1,
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    rotateZ: 0,
    handleAngle: 52,
  }),

  created() {
    if (!this.initialVisibleState) this.out();
  },

  computed: {
    style() {
      return {
        opacity: this.opacity,
        transition: `opacity ${secs(this.transitionTime)} ${this.transitionEasing}`,
      };
    },

    wrapperStyle() {
      return {
        transform: [
          `translateX(${px(this.translateX)})`,
          `translateY(${px(this.translateY)})`,
          `translateZ(${px(this.translateZ)})`,
          `rotateZ(${deg(this.rotateZ)})`,
        ].join(' '),
        transition: `transform ${secs(this.transitionTime)} ${this.transitionEasing}`,
      };
    },

    handleStyle() {
      const radius = '80px';
      const thickness = '10px';

      return {
        transform: `rotateX(-90deg) rotateZ(${deg(this.handleAngle)}) translateY(-50%) translateX(calc(${radius} - 5px)) translateZ(${thickness})`,
        transition: `transform ${secs(this.transitionTime)} ${this.transitionEasing}`,
      };
    },
  },

  methods: {
    async out(duration = 0.35) {
      this.$emit('animationstart');
      Object.assign(this, {
        transitionTime: duration,
        transitionEasing: 'ease-in',
        opacity: 0,
        rotateZ: 135,
        translateZ: -400,
      });

      await new Promise(resolve => setTimeout(resolve, duration * 1000));
      this.$emit('animationend');
    },

    async in(duration = 1) {
      this.$emit('animationstart');
      // Set initial position
      Object.assign(this, {
        transitionTime: 0,

        opacity: 0,
        rotateZ: -50,
        translateX: 0,
        translateY: 600,
        translateZ: -100,
        handleAngle: 52,
      });
      // Wait for CSS to be applied
      await this.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 20)); // Safari & firefox need extra time
      // Transition up
      Object.assign(this, {
        transitionTime: duration,
        transitionEasing: 'ease',

        opacity: 1,
        rotateZ: 0,
        translateY: 15,
        translateZ: 0,
      });
      await new Promise(resolve => setTimeout(resolve, duration * 1000));
      this.$emit('animationend');
    },
  },
};
