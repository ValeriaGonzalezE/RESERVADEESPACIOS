<template>

  <div class="profile-card">

    <div class="top">

      <img :src="user?.foto || defaultImg" class="avatar" />

      <div>

        <h2>
          {{ user?.nombre }}
          {{ user?.apellido }}
        </h2>

        <p class="rol">
          {{ user?.rol }}
        </p>

      </div>

    </div>

    <div class="info">

      <div class="item">
        <span>📧</span>
        <p>{{ user?.email }}</p>
      </div>

      <div class="item">
        <span>📱</span>
        <p>
          {{ user?.telefono || "Sin teléfono" }}
        </p>
      </div>

      <div class="item">
        <span>🆔</span>
        <p>{{ user?.codigo }}</p>
      </div>

    </div>

  </div>

</template>

<script setup>

defineProps({
  user: Object
});

const defaultImg =
  "https://cdn-icons-png.flaticon.com/128/13464/13464146.png";

</script>

<style scoped>
.profile-card {
  background:
    rgba(255, 255, 255, 0.04);
  border:
    1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.top {
  display: flex;
  align-items: center;
  gap: 18px;
}

.avatar {
  width: 95px;
  height: 95px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ff2e63;
}

h2 {
  margin: 0;
  font-size: 24px;
}

.rol {
  margin-top: 6px;
  color: #ff2e63;
  font-weight: bold;
  text-transform: capitalize;
}

.info {
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.item {
  background: #1a1a1a;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;

}

.item span {
  font-size: 20px;
}

.item p {
  margin: 0;
  color: #ddd;
}
</style>