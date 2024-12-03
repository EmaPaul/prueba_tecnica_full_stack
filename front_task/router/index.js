import { createRouter, createWebHistory } from 'vue-router';
import TaskBoard from '@/views/TaskBoard.vue'; 

const routes = [
  {
    path: '/task/:id', 
    name: 'TaskBoard',
    component: TaskBoard,
    props: true, 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
