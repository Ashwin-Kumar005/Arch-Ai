/**
 * ArchAI API Client SDK
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiClient {
  private static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("archai_token");
    }
    return null;
  }

  public static setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("archai_token", token);
    }
  }

  public static clearToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("archai_token");
    }
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorMsg = `HTTP Error ${res.status}`;
      try {
        const errJson = await res.json();
        errorMsg = errJson.detail || errorMsg;
      } catch {
        // ignore
      }
      throw new Error(errorMsg);
    }

    if (res.status === 204) {
      return {} as T;
    }

    return res.json();
  }

  // Auth
  static async login(email: string, password: string) {
    return this.request<any>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  static async demoLogin() {
    return this.request<any>("/api/v1/auth/demo-login", {
      method: "POST",
    });
  }

  static async register(email: string, password: string, full_name: string) {
    return this.request<any>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name }),
    });
  }

  // Projects
  static async getProjects() {
    return this.request<any[]>("/api/v1/projects");
  }

  static async getProject(id: string) {
    return this.request<any>(`/api/v1/projects/${id}`);
  }

  static async createProject(payload: any) {
    return this.request<any>("/api/v1/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async updateProject(id: string, payload: any) {
    return this.request<any>(`/api/v1/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  static async deleteProject(id: string) {
    return this.request<void>(`/api/v1/projects/${id}`, {
      method: "DELETE",
    });
  }

  // Requirements & Q&A
  static async analyzeProject(id: string) {
    return this.request<any>(`/api/v1/projects/${id}/analyze`, {
      method: "POST",
    });
  }

  static async getRequirements(id: string) {
    return this.request<any>(`/api/v1/projects/${id}/requirements`);
  }

  static async answerQuestions(id: string, answers: any[]) {
    return this.request<any>(`/api/v1/projects/${id}/questions/answer`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  }

  static async finalizeRequirements(id: string, payload: any = {}) {
    return this.request<any>(`/api/v1/projects/${id}/finalize`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // Orchestration
  static async startOrchestration(id: string) {
    return this.request<any>(`/api/v1/projects/${id}/orchestrate`, {
      method: "POST",
    });
  }

  static async getAgentRuns(id: string) {
    return this.request<any[]>(`/api/v1/projects/${id}/agent-runs`);
  }

  // Artifacts
  static async getArtifacts(id: string) {
    return this.request<any[]>(`/api/v1/projects/${id}/artifacts`);
  }

  static async getArtifact(projectId: string, artifactId: string) {
    return this.request<any>(`/api/v1/projects/${projectId}/artifacts/${artifactId}`);
  }

  static async updateArtifact(projectId: string, artifactId: string, payload: any) {
    return this.request<any>(`/api/v1/projects/${projectId}/artifacts/${artifactId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  static async upsertArtifactByType(projectId: string, artifactType: string, payload: any) {
    return this.request<any>(`/api/v1/projects/${projectId}/artifacts/by-type/${artifactType}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  // Specialized Deliverables
  static async getArchitecture(id: string) {
    return this.request<any>(`/api/v1/projects/${id}/architecture`);
  }

  static async getDatabase(id: string) {
    return this.request<any>(`/api/v1/projects/${id}/database`);
  }

  static async getApiSpec(id: string) {
    return this.request<any>(`/api/v1/projects/${id}/api-spec`);
  }

  static async getSecurity(id: string) {
    return this.request<any>(`/api/v1/projects/${id}/security`);
  }

  static async getTesting(id: string) {
    return this.request<any>(`/api/v1/projects/${id}/testing`);
  }

  static async getDeployment(id: string) {
    return this.request<any>(`/api/v1/projects/${id}/deployment`);
  }

  static async getValidation(id: string) {
    return this.request<any>(`/api/v1/projects/${id}/validation`);
  }

  static async getCodebase(id: string) {
    return this.request<any>(`/api/v1/projects/${id}/codebase`);
  }

  static async getRoadmap(id: string) {
    return this.request<any>(`/api/v1/projects/${id}/roadmap`);
  }

  static async getUIFlow(id: string) {
    return this.request<any>(`/api/v1/projects/${id}/uiflow`);
  }

  static async getTechDoc(id: string) {
    return this.request<any>(`/api/v1/projects/${id}/techdoc`);
  }

  // Documents & RAG
  static async getDocuments(id: string) {
    return this.request<any[]>(`/api/v1/projects/${id}/documents`);
  }

  static async uploadDocument(id: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/api/v1/projects/${id}/documents`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload document");
    }
    return res.json();
  }

  static async searchDocuments(id: string, query: string) {
    return this.request<any[]>(`/api/v1/projects/${id}/documents/search`, {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  }

  // System & Health
  static async getHealth() {
    return this.request<any>("/api/v1/health");
  }

  static async getAdminMetrics() {
    return this.request<any>("/api/v1/admin/metrics");
  }

  // SSE Stream URL
  static getStreamUrl(projectId: string): string {
    return `${API_BASE_URL}/api/v1/projects/${projectId}/stream`;
  }
}
