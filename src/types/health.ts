export interface HealthStatusOutput {
    app: 'up' | 'down';
    database: 'up' | 'down';
    timestamp: string;
}

export interface HealthStatusResponse {
    success: boolean;
    message: string;
    output: HealthStatusOutput;
}
