import axios, { AxiosInstance } from "axios";
import { logger } from "../../core/utils/logger";

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor(url: string) {
    this.axiosInstance = axios.create({
      baseURL: url,
    });
    logger.info(`ApiService initialized with url: ${url}`);
  }

  public async get(endpoint: string, params?: any) {
    try {
      logger.info(`Making GET request to ${endpoint}, and params: ${params}`);
      const response = await this.axiosInstance.get(endpoint, { params });
      logger.info(`Response from GET request to ${endpoint}: ${response.data}`);
      return response.data;
    } catch (error) {
      logger.error("Error making GET request:", error);
      throw error;
    }
  }

  public async post(endpoint: string, data: any) {
    try {
      logger.info(`Making POST request to ${endpoint}, and data: ${data}`);
      const response = await this.axiosInstance.post(endpoint, data);
      logger.info(
        `Response from POST request to ${endpoint}: ${response.data}`
      );
      return response.data;
    } catch (error) {
      logger.error("Error making POST request:", error);
      throw error;
    }
  }

  public async put(endpoint: string, data: any) {
    try {
      logger.info(`Making PUT request to ${endpoint}, and data: ${data}`);
      const response = await this.axiosInstance.put(endpoint, data);
      logger.info(`Response from PUT request to ${endpoint}: ${response.data}`);
      return response.data;
    } catch (error) {
      logger.error("Error making PUT request:", error);
      throw error;
    }
  }
}

export default ApiService;
