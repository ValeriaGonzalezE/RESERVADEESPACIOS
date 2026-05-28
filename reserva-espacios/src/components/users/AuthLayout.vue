<template>
  <div class="page-center">
    <div class="wrapper">

      <div class="info-text">
        <slot name="left" />
      </div>

      <div class="form-box">
        <slot />
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.page-center {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0f0f0f;
  overflow: hidden;
  padding: 10px;
}

.wrapper {
  display: flex;
  width: 900px;
  max-height: 300vh;
  background: #1e1e1e;
  border-radius: 10px;
  overflow: hidden;
}

.info-text {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 30px;
  font-weight: bold;
  background: #ff2e63;
  padding: 20px;
  text-align: center;
}

.form-box {
  flex: 1;
  padding: 50px 30px 50px 30px;
  overflow-y: auto;
  max-height: 90vh;
  scrollbar-width: thin;
}

/* SCROLL */
.form-box::-webkit-scrollbar {
  width: 6px;
}

.form-box::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 10px;
}

/* RESPONSIVE */
@media (max-width: 767px) {

  .wrapper {
    flex-direction: column;
    width: 100%;
    max-height: 95vh;
  }

  .info-text {
    min-height: 200px;
    font-size: 24px;
  }

  .form-box {
    max-height: 900px;
  }

}
</style>