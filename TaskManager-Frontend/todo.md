# Instructions

- 1. npm i axios

# Backend Routes

- POST /api/tasks - Create task
- GET /api/tasks - Get all tasks
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task
- Same pattern for /api/folders and /api/auth

## Updating Front End Routes

> Example of how to update the frontend routes to use the new api endpoints

```typescript
const fetchTasks = async () => {
  const response = await taskApi.getTasks();
  setTasks(response.data);
};
```
