export interface User {
  data(): User;
  id: string;
  email: string;
  username?: string;
  gender?: string;
  uid?: string;
}
export interface Project {
  id?: string;
  name?: string;
  uid: string;
}
export interface UserProjects {
  id?: string;
  userId?: string;
  projectId: string;
}
export interface Task {
  id?: string;
  description?: string;
  name: string;
  projectId?: string;
  assignee?: string;
  reporter?: string;
  status?: string;
}
