<template>
  <div class="flex flex-col items-center">
    <h1 class="text-2xl font-bold mb-4 mt-6">Lista de Tareas</h1>

    <div class="flex flex-col items-center w-full px-4 md:w-1/3 mb-4">
      <div class="flex items-center w-full space-x-2">
        <input
          type="text"
          v-model="searchQuery"
          class="flex-1 p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Buscar tareas..."
          @keyup.enter="filterTasks"
        />
        <button
          @click="filterTasks"
          class="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
        >
          Buscar
        </button>
      </div>
    </div>

    <!-- Spinner de carga -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="loader"></div>
    </div>

    <!-- Contenido de la lista de tareas -->
    <div v-else>
      <div v-if="filteredTasks.length">
        <div class="card-container p-8">
          <div
            class="card flex flex-col justify-between items-start"
            v-for="task in filteredTasks"
            :key="task._id"
          >
            <div>
              <h3 class="font-bold text-lg mb-2">{{ task.title }}</h3>
              <p class="mb-2 text-gray-700">{{ task.description }}</p>
            </div>
            <div class="flex items-center mt-auto">
              <span :class="statusColor(task.status)" class="status-indicator mr-2"></span>
              <p class="text-sm text-gray-600">{{ task.status }}</p>
            </div>
            <NuxtLink href="/tabla">
              <button
                class="mt-4 bg-green-700 text-white rounded-lg py-2 px-4 w-full text-center hover:bg-green-600"
              >
                Ir al tablero
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No hay tareas que mostrar.</p>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      tasks: [],
      searchQuery: '',
      filteredTasks: [],
      isLoading: true, // Nuevo estado para mostrar el spinner
    };
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await axios.get(`${useRuntimeConfig().public.appUrl}/api/getTaskAll`);
        this.tasks = response.data;
        this.filteredTasks = this.tasks;
      } catch (error) {
        console.error('Error al consumir la API:', error);
      } finally {
        this.isLoading = false; // Oculta el spinner cuando los datos están listos
      }
    },
    filterTasks() {
      const query = this.searchQuery.toLowerCase();
      this.filteredTasks = this.tasks.filter(task =>
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query)
      );
    },
    statusColor(status) {
      if (status === 'Pendiente') {
        return 'bg-red-500';
      } else if (status === 'En Proceso') {
        return 'bg-yellow-500';
      } else if (status === 'Completada') {
        return 'bg-green-500';
      }
      return 'bg-gray-500';
    },
  },
};
</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-bottom: 20px;
}

.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: 250px;
  min-height: 300px;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card:hover {
  transform: scale(1.05);
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
