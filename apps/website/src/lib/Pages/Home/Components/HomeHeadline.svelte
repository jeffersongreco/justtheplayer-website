<hgroup class="v-stack align-center">
  <h1>Just The Player</h1>
  <h2>See just what you click for</h2>
  <p>Use in Chrome</p>
</hgroup>

<style>
  hgroup {
    margin: 0 auto 0 auto;
    max-width: 600px;
    text-align: center;
  }

  hgroup * {
    transform: translateY(0);
    opacity: 1;
    transition:
      opacity 0.6s ease-out,
      transform 0.6s ease-out;
    animation-delay: 1.2s;
  }

  @starting-style {
    hgroup * {
      transform: translateY(50%);
      opacity: 0;
    }
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: white;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 56px;
    font-weight: 600;
    color: white;
    margin-bottom: 40px;
  }
</style>
