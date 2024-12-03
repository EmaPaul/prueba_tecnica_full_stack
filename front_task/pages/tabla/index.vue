<template>
  <div>
    <h1>Tablero de Tareas</h1>

    <div class="board">
      <!-- Columna para cada estado -->
      <div class="column" v-for="status in statuses" :key="status">
        <h2>{{ status }}</h2>
        <div class="task" v-for="task in filteredTasks[status]" :key="task._id">
          <h3>{{ task.title }}</h3>
          <p>{{ task.description }}</p>
          <p class="task-date"><strong>Creado el:</strong> {{ new Date(task.createdAt).toLocaleDateString() }}</p>

          <div class="task-actions">
            <button @click="openEditModal(task)">Editar</button>
            <button @click="openDeleteModal(task._id)">Eliminar</button>
            <button @click="openDetailModal(task)">Ver Detalle</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Ver Detalles -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Detalles de la Tarea</h3>
        <div class="modal-body">
          <p><strong>Título:</strong> {{ currentTask.title }}</p>
          <p><strong>Descripción:</strong> {{ currentTask.description }}</p>
          <p><strong>Estado:</strong> {{ currentTask.status }}</p>
        </div>
        <div class="modal-actions">
          <button class="modal-button" @click="closeModal">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal para Editar -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Editar Tarea</h3>
        <div class="modal-body">
          <label class="font-bold" for="title">Título:</label>
          <input
            id="title"
            v-model="editedTask.title"
            placeholder="Título"
            class="modal-input"
          />
          
          <label class="font-bold" for="description">Descripción:</label>
          <textarea
            id="description"
            v-model="editedTask.description"
            placeholder="Descripción"
            class="modal-textarea"
          ></textarea>
          
          <label class="font-bold" for="status">Estado:</label>
          <select
            id="status"
            v-model="editedTask.status"
            class="modal-select"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Completada">Completada</option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="modal-button save" @click="editTask">Guardar Cambios</button>
          <button class="modal-button cancel" @click="closeModal">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal para Confirmar Eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="font-bold">¿Estás seguro de que deseas eliminar esta tarea?</h3>
        <button class="mr-3 mt-5" @click="deleteTask(editedTask._id)">Sí, Eliminar</button>
        <button @click="closeModal">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      statuses: ["Pendiente", "En Proceso", "Completada"], // Estados de las tareas
      tasks: [], 
      showDetailModal: false,
      showEditModal: false, 
      showDeleteModal: false, 
      currentTask: null, 
      editedTask: null, 
    };
  },
  computed: {
    filteredTasks() {
      return this.statuses.reduce((acc, status) => {
        acc[status] = this.tasks.filter((task) => task.status === status);
        return acc;
      }, {});
    },
  },
  methods: {
    async fetchTasks() {
      try {
        const promises = this.statuses.map((status) =>
          fetch(
            `${useRuntimeConfig().public.appUrl}/api/getTaskByStatus/${status}`
          ).then((res) => res.json())
        );
        const results = await Promise.all(promises);
        this.tasks = results.flat();
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    },
    openDetailModal(task) {
      this.currentTask = task;
      this.showDetailModal = true;
    },
    closeModal() {
      this.showDetailModal = false;
      this.showEditModal = false;
      this.showDeleteModal = false;
    },
    openEditModal(task) {
      this.editedTask = { ...task };
      this.showEditModal = true;
    },
    async editTask() {
      try {
        const response = await fetch(
          `${useRuntimeConfig().public.appUrl}/api/updateTask/${this.editedTask._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.editedTask),
          }
        );
        if (response.ok) {
          alert("Tarea actualizada exitosamente.");
          this.tasks = this.tasks.map((task) =>
            task._id === this.editedTask._id ? this.editedTask : task
          );
          this.closeModal();
        } else {
          alert("Error al actualizar la tarea.");
        }
      } catch (error) {
        console.error("Error al editar la tarea:", error);
      }
    },
    openDeleteModal(taskId) {
      this.editedTask = this.tasks.find((task) => task._id === taskId);
      this.showDeleteModal = true;
    },
    async deleteTask(taskId) {
      try {
        const response = await fetch(
          `${useRuntimeConfig().public.appUrl}/api/deleteTask/${taskId}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          alert("Tarea eliminada exitosamente.");
          this.tasks = this.tasks.filter((task) => task._id !== taskId);
          this.closeModal();
        } else {
          alert("Error al eliminar la tarea.");
        }
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
      }
    },
  },
  mounted() {
    this.fetchTasks();
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
/* Estilo general */
h1 {
  text-align: center;
  margin: 16px 0;
  font-size: 24px;
  font-weight: bold;
  color: #000000;
}

/* Tablero */
.board {
  display: flex;
  gap: 16px;
  margin-top: -50px;
  padding: 60px;
  flex-wrap: wrap; 
}

.column {
  flex: 1;
  min-width: 250px; 
  background-color: #b2f0d1;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.column h2 {
  text-align: center;
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: bold;
}

/* Tareas */
.task {
  background-color: rgb(119, 238, 169);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.task h3 {
  margin: 0 0 6px;
  font-size: 16px;
  color: #000000;
  font-weight: bold;
}

.task p {
  margin: 0 0 8px;
  color: #000000;
  font-size: 14px;
}

.task-actions {
  display: flex;
  gap: 8px; 
  flex-wrap: wrap;
}

button {
  padding: 8px 12px;
  background-color: #21a70f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #00b32d;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%; 
  max-width: 400px;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
}

.modal-body {
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-button {
  padding: 8px 16px;
  background-color: #21a70f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.modal-button:hover {
  background-color: #00b32d;
}

.modal-input, .modal-textarea, .modal-select {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.modal-input:focus, .modal-textarea:focus, .modal-select:focus {
  border-color: #21a70f;
  box-shadow: 0 0 4px rgba(33, 167, 15, 0.5);
}


@media (max-width: 768px) {
  .board {
    flex-direction: column; 
    padding: 49px;
  }

  .column {
    min-width: 100%; 
    margin-bottom: 16px;
  }

  .modal-content {
    width: 100%; 
    padding: 16px;
  }

  button {
    font-size: 12px; 
    padding: 6px 10px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 20px; 
  }

  .task h3 {
    font-size: 14px; 
  }

  .task p {
    font-size: 12px; 
  }
}

.task-actions {
  display: flex;
  gap: 8px; 
  flex-wrap: wrap;
}

button {
  padding: 8px 12px;
  background-color: #21a70f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #00b32d;
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 100%;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
}

.modal-body {
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-button {
  padding: 8px 16px;
  background-color: #21a70f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.modal-button:hover {
  background-color: #00b32d;
}

.modal-input, .modal-textarea, .modal-select {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.modal-input:focus, .modal-textarea:focus, .modal-select:focus {
  border-color: #21a70f;
  box-shadow: 0 0 4px rgba(33, 167, 15, 0.5);
}
</style>
