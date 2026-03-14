<div class="floating-cursor">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 70 112"
    preserveAspectRatio="xMidYMid meet"
    style="width: 100%; height: 100%; display: block;"
    fill="none"
  >
    <path
      d="M6.2196 84.5555L4.71948 10.7391L59.3237 63.0382L32.7716 64.2336L50.923 102.786L39.2221 106.521L21.9708 69.3141L6.2196 84.5555Z"
      fill="#111111"
    />
    <path
      d="M70 67.045L39.7079 68.4085L57.1711 105.498L36.8053 112L20.5489 76.9392L1.92964 94.9564L0 0L70 67.045ZM6.21962 84.5555L21.9708 69.3141L39.2221 106.521L50.923 102.785L32.7717 64.2336L59.3237 63.0382L4.7195 10.7391L6.21962 84.5555Z"
      fill="white"
    />
  </svg>
</div>

<style>
  .floating-cursor {
    width: 80px;
    opacity: 1;
    transition: opacity 0.3s ease-out;
    transition-delay: 2.3s;
    filter: drop-shadow(0 20px 28px rgba(0, 0, 0, 0.25))
      drop-shadow(0 10px 14px rgba(0, 0, 0, 0.45))
      drop-shadow(0 5px 7px rgba(0, 0, 0, 0.45));
  }

  @starting-style {
    .floating-cursor {
      opacity: 0;
    }
  }
</style>
