
export interface Role {
    id: number;
    name: string;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    roleId: number;
  }
  
  export interface Blog {
    id: number;
    title: string;
    content: string;
    userId: number;
  }
  