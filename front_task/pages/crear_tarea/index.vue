<template>
  <div 
    class="flex items-center justify-center min-h-screen" 
    style="min-height: 92vh;" 
    @click="handleOutsideClick"
  >
    <div 
      class="w-96 bg-green-200 p-6 rounded-lg shadow-lg border-gray-400-6" 
      @click.stop
    >
      <h2 class="text-2xl font-bold text-center text-gray-900 mb-6">Crear Tarea</h2>
      
      <form @submit.prevent="submitForm">
        <div class="mb-5">
          <label for="titulo" class="block mb-2 text-sm font-medium text-gray-900">Título</label>
          <input 
            v-model="task.title" 
            type="text" 
            id="titulo" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3" 
            placeholder="Introduce el título" 
            required 
          />
        </div>
        <div class="mb-5">
          <label for="descripcion" class="block mb-2 text-sm font-medium text-gray-900">Descripción</label>
          <textarea 
            v-model="task.description" 
            id="descripcion" 
            rows="4" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3" 
            placeholder="Introduce una descripción detallada">
          </textarea>
        </div>
        <div class="mb-5">
          <label class="block mb-2 text-sm font-medium text-gray-900">Estatus</label>
          <div class="flex items-center mb-2">
            <input 
              v-model="task.status" 
              type="radio" 
              id="en-proceso" 
              value="En Proceso" 
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" 
            />
            <label for="en-proceso" class="ml-2 text-sm font-medium text-gray-900">En Proceso</label>
          </div>
          <div class="flex items-center mb-2">
            <input 
              v-model="task.status" 
              type="radio" 
              id="pendiente" 
              value="Pendiente" 
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" 
            />
            <label for="pendiente" class="ml-2 text-sm font-medium text-gray-900">Pendiente</label>
          </div>
          <div class="flex items-center mb-2">
            <input 
              v-model="task.status" 
              type="radio" 
              id="completada" 
              value="Completada" 
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" 
            />
            <label for="completada" class="ml-2 text-sm font-medium text-gray-900">Completada</label>
          </div>
        </div>
        <button 
          type="submit" 
          :disabled="loading"
          class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-3 text-center flex justify-center items-center">
          <span v-if="!loading">Crear</span>
          <span v-else class="flex items-center">
            <svg 
              class="animate-spin mr-2 h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24">
              <circle 
                class="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                stroke-width="4">
              </circle>
              <path 
                class="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8v8H4z">
              </path>
            </svg>
            Cargando...
          </span>
        </button>
      </form>
    </div>

    <!-- Modal -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h3 class="text-xl font-semibold text-gray-900">Tarea Creada</h3>
        <p class="text-gray-700 mt-2">¡La tarea se ha creado exitosamente!</p>
        <button 
          @click="closeModal" 
          class="mt-4 text-white bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      task: {
        title: "",
        description: "",
        status: "",
      },
      showModal: false,
      loading: false,
    };
  },
  methods: {
    async submitForm() {
      this.loading = true;
      try {
        const response = await axios.post(
          `${useRuntimeConfig().public.appUrl}/api/createTask`,
          this.task
        );
        console.log("Tarea creada:", response.data);
        this.showModal = true;
      } catch (error) {
        console.error("Error al crear la tarea:", error);
      } finally {
        this.loading = false;
      }
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    resetForm() {
      this.task.title = "";
      this.task.description = "";
      this.task.status = "";
    },
    handleOutsideClick(event) {
      // Si el clic no ocurre sobre un input o textarea, deseleccionar los radios.
      if (!event.target.closest("input, textarea")) {
        this.task.status = "";
      }
    },
  },
};
</script>

<style scoped>
</style>
